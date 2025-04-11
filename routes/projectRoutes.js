import express from 'express';
import Project from '../models/Project.js';
import Comment from '../models/Comment.js';
import Activity from '../models/Activity.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all projects with filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { status: 'open' }; // Default to only show open projects
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.skills && req.query.skills.length) {
      filter.skills = { $in: Array.isArray(req.query.skills) ? req.query.skills : [req.query.skills] };
    }
    
    if (req.query.minBudget) {
      filter.budget = { ...filter.budget, $gte: parseInt(req.query.minBudget) };
    }
    
    if (req.query.maxBudget) {
      filter.budget = { ...filter.budget, $lte: parseInt(req.query.maxBudget) };
    }
    
    // Build sort object
    let sort = { createdAt: -1 }; // Default sort by most recent
    
    if (req.query.sort === 'budget_high') {
      sort = { budget: -1 };
    } else if (req.query.sort === 'budget_low') {
      sort = { budget: 1 };
    } else if (req.query.sort === 'deadline') {
      sort = { deadline: 1 };
    } else if (req.query.sort === 'popular') {
      sort = { views: -1 };
    }
    
    // Execute query with pagination
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('clientId', 'username profile')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 }, limit: 5 },
        populate: {
          path: 'userId',
          select: 'username profile'
        }
      });
    
    // Get total count for pagination
    const total = await Project.countDocuments(filter);
    
    res.json({
      projects,
      hasMore: total > skip + projects.length,
      total
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'username profile')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'username profile'
        }
      });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Increment view count
    project.views += 1;
    await project.save();
    
    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a project
router.post('/:id/like', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const userId = req.user.id;
    const isLiked = project.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      project.likes = project.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      project.likes.push(userId);
      
      // Record activity
      await Activity.create({
        userId,
        type: 'like',
        projectId: project._id
      });
    }
    
    await project.save();
    
    res.json({ likes: project.likes });
  } catch (err) {
    console.error('Error liking project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save/bookmark a project
router.post('/:id/save', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const userId = req.user.id;
    const isSaved = project.savedBy.includes(userId);
    
    if (isSaved) {
      // Unsave
      project.savedBy = project.savedBy.filter(id => id.toString() !== userId);
    } else {
      // Save
      project.savedBy.push(userId);
      
      // Record activity
      await Activity.create({
        userId,
        type: 'save',
        projectId: project._id
      });
    }
    
    await project.save();
    
    res.json({ savedBy: project.savedBy });
  } catch (err) {
    console.error('Error saving project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Share a project
router.post('/:id/share', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Increment share count
    project.shares += 1;
    await project.save();
    
    // Record activity
    await Activity.create({
      userId: req.user.id,
      type: 'share',
      projectId: project._id
    });
    
    res.json({ shares: project.shares });
  } catch (err) {
    console.error('Error sharing project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a project
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Create new comment
    const comment = await Comment.create({
      projectId: project._id,
      userId: req.user.id,
      content
    });
    
    // Populate user data
    await comment.populate('userId', 'username profile');
    
    // Record activity
    await Activity.create({
      userId: req.user.id,
      type: 'comment',
      projectId: project._id,
      commentId: comment._id
    });
    
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/', auth, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description, category, budget, deadline, skills } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Process file uploads
    const attachments = req.files ? req.files.map(file => ({
      name: file.originalname,
      url: file.path,
      type: file.mimetype
    })) : [];
    
    // Create new project
    const project = new Project({
      title,
      description,
      clientId: req.user.id,
      budget: Number(budget),
      deadline: new Date(deadline),
      category,
      skills: Array.isArray(skills) ? skills : [skills],
      attachments,
      status: 'open'
    });
    
    await project.save();
    
    // Create notification for admin (optional)
    await Notification.create({
      userId: req.user.id, // This could be changed to admin user ID
      type: 'new_project',
      message: `New project "${title}" has been posted`,
      projectId: project._id
    });
    
    res.status(201).json({
      message: 'Project created successfully',
      projectId: project._id
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a project
router.put('/:id', auth, upload.array('attachments', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, budget, deadline, skills, status } = req.body;
    
    // Find project
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the project owner
    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this project' });
    }
    
    // Update project fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (budget) project.budget = Number(budget);
    if (deadline) project.deadline = new Date(deadline);
    if (skills) project.skills = Array.isArray(skills) ? skills : [skills];
    if (status && ['draft', 'open', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      project.status = status;
    }
    
    // Process new file uploads
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        name: file.originalname,
        url: file.path,
        type: file.mimetype
      }));
      
      project.attachments = [...project.attachments, ...newAttachments];
    }
    
    await project.save();
    
    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find project
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the project owner
    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this project' });
    }
    
    // Check if project can be deleted (not in progress)
    if (project.status === 'in_progress') {
      return res.status(400).json({ message: 'Cannot delete a project that is in progress' });
    }
    
    // Delete project
    await Project.findByIdAndDelete(id);
    
    // Delete related applications
    await Application.deleteMany({ projectId: id });
    
    // Delete related comments
    await Comment.deleteMany({ projectId: id });
    
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
