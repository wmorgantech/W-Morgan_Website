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
  location: 160,
  slug: 180,
  category: 120,
  summary: 500,
  description: 10000,
  icon: 120,
  imageUrl: 2048,
  coverImage: 2048,
  clientLogo: 2048,
  clientName: 160,
  projectUrl: 2048,
  role: 160,
  company: 160,
  avatarUrl: 2048,
  designation: 160,
  memberType: 40,
  department: 160,
  photoUrl: 2048,
  professionalSummary: 4000,
  experience: 300,
};

// Longer entries for list fields whose lines hold a sentence or two.
const arrayItemLimits = {
  responsibilities: 400,
  skills: 400,
  education: 300,
  strengths: 300,
  projects: 600,
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
  choices = {},
  idArrayFields = [],
) {
  const validators = [
    ...stringFields(fields, requiredFields),
    ...arrayFields.flatMap((field) => [
      body(field).optional().isArray({ max: 40 }),
      body(`${field}.*`)
        .isString()
        .isLength({ max: arrayItemLimits[field] || 200 }),
    ]),
    ...idArrayFields.flatMap((field) => [
      body(field).optional().isArray({ max: 40 }),
      body(`${field}.*`).isInt({ min: 1 }).toInt(),
    ]),
    ...Object.entries(choices).map(([field, values]) =>
      body(field).optional().isIn(values),
    ),
    ...booleanFields.map((field) => body(field).optional().isBoolean()),
    body('sortOrder').optional().isInt({ min: 0 }).toInt(),
  ];

  return validateBody(validators, [
    ...fields,
    ...arrayFields,
    ...idArrayFields,
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
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: { categories: true },
    prepareData: (data, operation) => {
      const { categoryIds, ...projectData } = data;
      return categoryIds === undefined
        ? projectData
        : {
            ...projectData,
            categories: {
              [operation === 'create' ? 'connect' : 'set']: categoryIds.map(
                (id) => ({ id }),
              ),
            },
          };
    },
    transform: (project) => ({
      ...project,
      categories: project.categories || [],
      categoryIds: (project.categories || []).map(({ id }) => id),
    }),
    fields: [
      'title',
      'slug',
      'summary',
      'description',
      'coverImage',
      'clientLogo',
      'clientName',
      'projectUrl',
    ],
    required: ['title'],
    arrays: ['tags'],
    idArrays: ['categoryIds'],
    booleans: ['featured'],
  },
  'portfolio-categories': {
    model: 'portfolioCategory',
    slugSource: 'name',
    publicWhere: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    fields: ['name', 'slug'],
    required: ['name'],
    arrays: [],
    booleans: ['isActive'],
  },
  testimonials: {
    model: 'testimonial',
    fields: ['quote', 'authorName', 'location', 'role', 'company', 'avatarUrl'],
    required: ['authorName'],
    arrays: [],
    booleans: ['featured'],
    publicWhere: { featured: true },
  },
  team: {
    model: 'teamMember',
    publicDetail: true,
    publicWhere: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    fields: [
      'name',
      'designation',
      'memberType',
      'department',
      'location',
      'photoUrl',
      'professionalSummary',
      'experience',
    ],
    required: ['name', 'designation'],
    arrays: [
      'responsibilities',
      'skills',
      'education',
      'strengths',
      'projects',
    ],
    booleans: ['published'],
    choices: { memberType: ['LEADERSHIP', 'EMPLOYEE', 'INTERN'] },
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
    config.choices,
    config.idArrays,
  );
  const updateValidation = createContentValidation(
    config.fields,
    [],
    config.arrays,
    config.booleans,
    config.choices,
    config.idArrays,
  );
  const idValidation = validateParams([param('id').isInt({ min: 1 })]);

  router.get('/', controller.listPublic);
  router.get('/manage', authenticate, controller.listAll);
  if (config.publicDetail) {
    router.get('/:id', idValidation, controller.getPublic);
  }
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
