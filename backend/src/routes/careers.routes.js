const { Router } = require('express');
const { body, param } = require('express-validator');

const {
  createCareersController,
} = require('../controllers/careers.controller');

const { createAuthenticateAdmin } = require('../middleware/authenticateAdmin');
const { validateBody } = require('../middleware/validateBody');
const { validateParams } = require('../middleware/validateParams');
const { createRateLimiter } = require('../middleware/rateLimit');

const careersService = require('../services/careers.service');

const openingFields = [
  'jobTitle',
  'slug',
  'department',
  'experience',
  'location',
  'employmentType',
  'description',
  'skills',
  'status',
];

const openingFieldLimits = {
  jobTitle: 160,
  slug: 180,
  department: 120,
  experience: 120,
  location: 180,
  employmentType: 32,
  description: 10000,
  skills: 100,
  status: 16,
};

const openingValidation = (required = []) =>
  validateBody(
    [
      ...openingFields
        .filter(
          (field) =>
            !['skills', 'employmentType', 'status'].includes(field),
        )
        .map((field) =>
          required.includes(field)
            ? body(field)
                .isString()
                .trim()
                .isLength({ min: 1, max: openingFieldLimits[field] })
            : body(field)
                .optional()
                .isString()
                .isLength({ max: openingFieldLimits[field] }),
        ),

      body('employmentType')
        .if(
          (_value, { req }) =>
            required.includes('employmentType') ||
            req.body.employmentType !== undefined,
        )
        .isIn(careersService.employmentTypes),

      body('status')
        .optional()
        .isIn(careersService.jobOpeningStatuses),

      body('skills').optional().isArray({ max: 40 }),

      body('skills.*').optional().isString().isLength({ max: 100 }),
    ],
    openingFields,
  );

const applicationValidation = validateBody(
  [
    body('jobOpeningId')
      .isInt({ min: 1 })
      .toInt(),

    body('candidateName').isString().trim().isLength({ min: 1, max: 160 }),

    body('email').isEmail().isLength({ max: 254 }).normalizeEmail(),

    body('phone').optional().isString().isLength({ max: 64 }),

    body('coverLetter').optional().isString().isLength({ max: 10000 }),

    body('resumeUrl')
      .optional()
      .isString()
      .isLength({ max: 2048 }),
  ],
  [
    'jobOpeningId',
    'candidateName',
    'email',
    'phone',
    'coverLetter',
    'resumeUrl',
  ],
);

const applicationStatusValidation = validateBody(
  [
    body('status')
      .isIn(careersService.jobApplicationStatuses),
  ],
  ['status'],
);

const idValidation = validateParams([
  param('id')
    .isInt({ min: 1 }),
]);

function createCareersRouter(prisma, jwtSecret) {
  const router = Router();

  const controller = createCareersController(prisma);
  const authenticate = createAuthenticateAdmin(prisma, jwtSecret);
  const applicationLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: 'Too many job applications. Try again later.',
  });

  // ========================================
  // PUBLIC CAREERS
  // ========================================

  router.get(
    '/openings',
    controller.listPublicOpenings,
  );

  router.post(
    '/applications',
    applicationLimiter,
    applicationValidation,
    controller.createApplication,
  );

  // ========================================
  // ADMIN APPLICATIONS
  // ========================================

  router.get(
    '/applications',
    authenticate,
    controller.listApplications,
  );

  router.patch(
    '/applications/:id',
    authenticate,
    idValidation,
    applicationStatusValidation,
    controller.updateApplication,
  );

  // ========================================
  // ADMIN JOB OPENINGS
  // ========================================

  router.get(
    '/manage',
    authenticate,
    controller.listOpenings,
  );

  router.post(
    '/',
    authenticate,
    openingValidation([
      'jobTitle',
      'employmentType',
      'description',
    ]),
    controller.createOpening,
  );

  router.patch(
    '/:id',
    authenticate,
    idValidation,
    openingValidation(),
    controller.updateOpening,
  );

  router.delete(
    '/:id',
    authenticate,
    idValidation,
    controller.removeOpening,
  );

  return router;
}

module.exports = {
  createCareersRouter,
};