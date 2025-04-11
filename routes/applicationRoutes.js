import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Application from '../models/Application.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/applications';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept common file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word, PowerPoint, and image files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Submit application for a project
router.post('/projects/:projectId/apply', auth, upload.array('attachments', 5), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { coverLetter, proposedBudget, estimatedDuration } = req.body;
    
    // Validate required fields
    if (!coverLetter) {
      return res.status(400).json({ message: 'Cover letter is required' });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has already applied
    const existingApplication = await Application.findOne({
      projectId,
      freelancerId: req.user.id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this project' });
    }
    
    // Process file uploads
    const attachments = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size
    }));
    
    // Create new application
    const application = new Application({
      projectId,
      freelancerId: req.user.id,
      coverLetter,
      proposedBudget: proposedBudget || project.budget,
      estimatedDuration,
      attachments,
      status: 'pending'
    });
    
    await application.save();
    
    // Create notification for project owner
    await Notification.create({
      userId: project.clientId,
      type: 'new_application',
      message: `You have a new application for "${project.title}"`,
      projectId,
      applicationId: application._id
    });
    
    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications for a project (client only)
router.get('/projects/:projectId/applications', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists and user is the owner
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to view these applications' });
    }
    
    // Get applications with freelancer details
    const applications = await Application.find({ projectId })
      .populate('freelancerId', 'username profile')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's applications (freelancer)
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ freelancerId: req.user.id })
      .populate('projectId', 'title budget deadline status')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error('Error fetching user applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (client only)
router.patch('/applications/:applicationId/status', auth, async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'accepted', 'rejected', 'shortlisted'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      // Find application
      const application = await Application.findById(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      // Check if user is the project owner
      const project = await Project.findById(application.projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      if (project.clientId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to update this application' });
      }
      
      // Update application status
      application.status = status;
      await application.save();
      
      // Create notification for freelancer
      let notificationMessage;
      
      switch (status) {
        case 'accepted':
          notificationMessage = `Your application for "${project.title}" has been accepted!`;
          break;
        case 'rejected':
          notificationMessage = `Your application for "${project.title}" has been declined.`;
          break;
        case 'shortlisted':
          notificationMessage = `Your application for "${project.title}" has been shortlisted.`;
          break;
        default:
          notificationMessage = `The status of your application for "${project.title}" has been updated.`;
      }
      
      await Notification.create({
        userId: application.freelancerId,
        type: `application_${status}`,
        message: notificationMessage,
        projectId: project._id,
        applicationId: application._id
      });
      
      res.json({
        message: 'Application status updated successfully',
        application
      });
    } catch (err) {
      console.error('Error updating application status:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get application details
  router.get('/applications/:applicationId', auth, async (req, res) => {
    try {
      const { applicationId } = req.params;
      
      const application = await Application.findById(applicationId)
        .populate('freelancerId', 'username profile')
        .populate('projectId', 'title description budget deadline status clientId');
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      // Check if user is authorized (either the applicant or the project owner)
      const project = await Project.findById(application.projectId);
      
      if (
        application.freelancerId._id.toString() !== req.user.id && 
        project.clientId.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: 'You are not authorized to view this application' });
      }
      
      res.json(application);
    } catch (err) {
      console.error('Error fetching application:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Download application attachment
  router.get('/applications/:applicationId/attachments/:filename', auth, async (req, res) => {
    try {
      const { applicationId, filename } = req.params;
      
      const application = await Application.findById(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      // Check if user is authorized (either the applicant or the project owner)
      const project = await Project.findById(application.projectId);
      
      if (
        application.freelancerId.toString() !== req.user.id && 
        project.clientId.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: 'You are not authorized to access this file' });
      }
      
      // Find the attachment
      const attachment = application.attachments.find(att => att.filename === filename);
      
      if (!attachment) {
        return res.status(404).json({ message: 'Attachment not found' });
      }
      
      // Send the file
      res.download(attachment.path, attachment.originalName);
    } catch (err) {
      console.error('Error downloading attachment:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  export default router;
  
