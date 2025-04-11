import { body, validationResult } from 'express-validator';

// User validation
export const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('role')
    .isIn(['freelancer', 'client'])
    .withMessage('Role must be either freelancer or client'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Project validation
export const validateProject = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Project title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Project description must be between 20 and 5000 characters'),
  body('category')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('budget.minAmount')
    .isNumeric()
    .withMessage('Minimum budget must be a number')
    .custom((value, { req }) => {
      if (value < 0) throw new Error('Minimum budget cannot be negative');
      return true;
    }),
  body('budget.maxAmount')
    .isNumeric()
    .withMessage('Maximum budget must be a number')
    .custom((value, { req }) => {
      if (value < req.body.budget.minAmount) {
        throw new Error('Maximum budget cannot be less than minimum budget');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
