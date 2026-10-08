const { Router } = require('express');
const { body, param } = require('express-validator');
const {
  createContentController,
} = require('../controllers/content.controller');
const { createAuthenticateAdmin } = require('../middleware/authenticateAdmin');
const { validateBody } = require('../middleware/validateBody');
const { validateParams } = require('../middleware/validateParams');

const fieldLengthLimits = {
  name: 160,
  title: 200,
  quote: 10000,
  authorName: 160,
  slug: 180,
  category: 120,
  summary: 500,
  description: 10000,
  icon: 120,
  imageUrl: 2048,
  coverImage: 2048,
  clientName: 160,
  projectUrl: 2048,
  role: 160,
  company: 160,
  avatarUrl: 2048,
};

const stringFields = (fields, required = []) =>
  fields.map((field) =>
    required.includes(field)
      ? body(field)
          .isString()
          .trim()
          .isLength({ min: 1, max: fieldLengthLimits[field] })
      : body(field)
          .optional()
          .isString()
          .isLength({ max: fieldLengthLimits[field] }),
  );

function createContentValidation(
  fields,
  requiredFields,
  arrayFields,
  booleanFields,
) {
  const validators = [
    ...stringFields(fields, requiredFields),
    ...arrayFields.flatMap((field) => [
      body(field).optional().isArray({ max: 40 }),
      body(`${field}.*`).isString().isLength({ max: 200 }),
    ]),
    ...booleanFields.map((field) => body(field).optional().isBoolean()),
    body('sortOrder').optional().isInt({ min: 0 }).toInt(),
  ];

  return validateBody(validators, [
    ...fields,
    ...arrayFields,
    ...booleanFields,
    'sortOrder',
  ]);
}

const definitions = {
  services: {
    model: 'service',
    slugSource: 'name',
    publicWhere: { isActive: true },
    fields: ['name', 'slug', 'summary', 'description', 'icon'],
    required: ['name'],
    arrays: ['features'],
    booleans: ['isActive'],
  },
  products: {
    model: 'product',
    slugSource: 'name',
    publicWhere: { isActive: true },
    fields: ['name', 'category', 'description', 'slug', 'imageUrl'],
    required: ['name', 'category', 'description'],
    arrays: ['features'],
    booleans: ['isActive'],
  },
  portfolio: {
    model: 'project',
    slugSource: 'title',
    publicWhere: { featured: true },
    fields: [
      'title',
      'slug',
      'summary',
      'description',
      'coverImage',
      'clientName',
      'projectUrl',
    ],
    required: ['title'],
    arrays: ['tags'],
    booleans: ['featured'],
  },
  testimonials: {
    model: 'testimonial',
    fields: ['quote', 'authorName', 'role', 'company', 'avatarUrl'],
    required: ['quote', 'authorName'],
    arrays: [],
    booleans: ['featured'],
    publicWhere: { featured: true },
  },
};

function createContentRouter(prisma, config, jwtSecret) {
  const router = Router();
  const controller = createContentController(prisma, config);
  const authenticate = createAuthenticateAdmin(prisma, jwtSecret);
  const createValidation = createContentValidation(
    config.fields,
    config.required,
    config.arrays,
    config.booleans,
  );
  const updateValidation = createContentValidation(
    config.fields,
    [],
    config.arrays,
    config.booleans,
  );
  const idValidation = validateParams([param('id').isInt({ min: 1 })]);

  router.get('/', controller.listPublic);
  router.get('/manage', authenticate, controller.listAll);
  router.post('/', authenticate, createValidation, controller.create);
  router.patch(
    '/:id',
    authenticate,
    idValidation,
    updateValidation,
    controller.update,
  );
  router.delete('/:id', authenticate, idValidation, controller.remove);
  return router;
}

module.exports = { definitions, createContentRouter };
