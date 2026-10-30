const assert = require('node:assert/strict');
const { mkdtemp, readFile, readdir, rm } = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { describe, it } = require('node:test');
const request = require('supertest');
const { createApp } = require('../src/server');

const config = {
  port: 0,
  jwtSecret: 'test-jwt-secret-that-is-at-least-32-bytes',
  adminSetupToken: 'test-setup-code-that-is-at-least-32-bytes',
  jwtExpiresIn: '1d',
  corsOrigins: ['http://localhost:5173'],
};

function createModel(rows = []) {
  let nextId = Math.max(0, ...rows.map((row) => row.id || 0)) + 1;

  return {
    rows,
    findMany: async ({ where, orderBy, include } = {}) => {
      let result = rows.filter((row) =>
        Object.entries(where || {}).every(([key, value]) => row[key] === value),
      );
      if (orderBy) {
        const [field, direction] = Object.entries(
          Array.isArray(orderBy) ? orderBy[0] : orderBy,
        )[0];
        result = [...result].sort((left, right) =>
          left[field] < right[field]
            ? direction === 'desc'
              ? 1
              : -1
            : left[field] > right[field]
              ? direction === 'desc'
                ? -1
                : 1
              : 0,
        );
      }
      if (include?.jobOpening) {
        result = result.map((row) => ({
          ...row,
          jobOpening: { jobTitle: 'Engineer' },
        }));
      }
      return result;
    },
    findFirst: async ({ where } = {}) =>
      rows.find((row) =>
        Object.entries(where || {}).every(([key, value]) => row[key] === value),
      ) || null,
    findUnique: async ({ where }) =>
      rows.find((row) =>
        Object.entries(where).every(([key, value]) => row[key] === value),
      ) || null,
    count: async ({ where } = {}) =>
      rows.filter((row) =>
        Object.entries(where || {}).every(([key, value]) => row[key] === value),
      ).length,
    create: async ({ data }) => {
      const row = {
        id: nextId++,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        ...data,
      };
      rows.push(row);
      return row;
    },
    update: async ({ where, data }) => {
      const row = rows.find((item) => item.id === where.id);
      if (!row) {
        const error = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      Object.assign(row, data);
      return row;
    },
    delete: async ({ where }) => {
      const index = rows.findIndex((item) => item.id === where.id);
      if (index < 0) {
        const error = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      return rows.splice(index, 1)[0];
    },
  };
}

function createFixture({ uploadsDirectory } = {}) {
  const admins = createModel();
  const createAdmin = admins.create;
  admins.create = ({ data }) =>
    createAdmin({ data: { isActive: true, ...data } });
  const settings = new Map();
  const services = createModel([
    { id: 1, name: 'Live', slug: 'live', isActive: true, sortOrder: 1 },
    { id: 2, name: 'Hidden', slug: 'hidden', isActive: false, sortOrder: 2 },
  ]);
  const products = createModel([
    { id: 1, name: 'Public product', isActive: true, sortOrder: 1 },
    { id: 2, name: 'Hidden product', isActive: false, sortOrder: 2 },
  ]);
  const projects = createModel([
    { id: 1, title: 'Project', slug: 'project', featured: true, sortOrder: 1 },
    {
      id: 2,
      title: 'Hidden Project',
      slug: 'hidden-project',
      featured: false,
      sortOrder: 2,
    },
  ]);
  const portfolioCategories = createModel();
  const projectCategoryIds = new Map();
  const baseProjectFindMany = projects.findMany;
  const baseProjectCreate = projects.create;
  const baseProjectUpdate = projects.update;
  projects.findMany = async (query = {}) => {
    const rows = await baseProjectFindMany(query);
    return query.include?.categories
      ? rows.map((project) => ({
          ...project,
          categories: (projectCategoryIds.get(project.id) || [])
            .map((id) =>
              portfolioCategories.rows.find((category) => category.id === id),
            )
            .filter(Boolean),
        }))
      : rows;
  };
  const includeProjectCategories = (project, include) =>
    include?.categories
      ? {
          ...project,
          categories: (projectCategoryIds.get(project.id) || [])
            .map((id) =>
              portfolioCategories.rows.find((category) => category.id === id),
            )
            .filter(Boolean),
        }
      : project;
  projects.create = async ({ data, ...options }) => {
    const { categories, ...projectData } = data;
    const project = await baseProjectCreate({ data: projectData, ...options });
    if (categories?.set || categories?.connect) {
      projectCategoryIds.set(
        project.id,
        (categories.set || categories.connect).map(({ id }) => id),
      );
    }
    return includeProjectCategories(project, options.include);
  };
  projects.update = async ({ where, data, ...options }) => {
    const { categories, ...projectData } = data;
    const project = await baseProjectUpdate({
      where,
      data: projectData,
      ...options,
    });
    if (categories?.set) {
      projectCategoryIds.set(
        project.id,
        categories.set.map(({ id }) => id),
      );
    }
    return includeProjectCategories(project, options.include);
  };
  const testimonials = createModel([
    { id: 1, quote: 'Featured', featured: true, sortOrder: 1 },
    { id: 2, quote: 'Unfeatured', featured: false, sortOrder: 2 },
  ]);
  const teamMembers = createModel();
  const contactInquiries = createModel();
  const jobOpenings = createModel([
    { id: 1, jobTitle: 'Engineer', slug: 'engineer', status: 'OPEN' },
    { id: 2, jobTitle: 'Closed role', slug: 'closed-role', status: 'CLOSED' },
  ]);
  const createJobOpening = jobOpenings.create;
  jobOpenings.create = ({ data }) =>
    createJobOpening({ data: { status: 'OPEN', ...data } });
  const jobApplications = createModel();

  const prisma = {
    admin: admins,
    service: services,
    product: products,
    project: projects,
    portfolioCategory: portfolioCategories,
    testimonial: testimonials,
    teamMember: teamMembers,
    contactInquiry: contactInquiries,
    jobOpening: jobOpenings,
    jobApplication: jobApplications,
    siteSetting: {
      findMany: async () =>
        [...settings].map(([key, value]) => ({ key, value })),
      upsert: async ({ where, create, update }) => {
        const value = settings.has(where.key) ? update.value : create.value;
        settings.set(where.key, value);
        return { key: where.key, value };
      },
    },
    $queryRaw: async () => [{ '?column?': 1 }],
    $transaction: async (operations) =>
      typeof operations === 'function'
        ? operations(prisma)
        : Promise.all(operations),
  };
  const app = createApp({ prismaClient: prisma, config, uploadsDirectory });
  return { app, prisma };
}

async function registerAdmin(app) {
  const response = await request(app).post('/api/auth/register').send({
    name: 'Site Admin',
    email: 'admin@example.com',
    password: 'correct-horse',
    setupCode: config.adminSetupToken,
  });
  assert.equal(response.status, 201);
  return response.body.accessToken;
}

describe('Express API', () => {
  it('uploads supported images for admins and serves their public paths', async () => {
    const uploadsDirectory = await mkdtemp(
      path.join(os.tmpdir(), 'wmorgan-uploads-'),
    );
    try {
      const { app } = createFixture({ uploadsDirectory });
      await request(app)
        .post('/api/uploads')
        .attach('file', Buffer.from('not authenticated'), {
          filename: 'logo.png',
          contentType: 'image/png',
        })
        .expect(401);

      const token = await registerAdmin(app);
      const png = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
      ]);
      const uploaded = await request(app)
        .post('/api/uploads')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', png, {
          filename: 'logo.png',
          contentType: 'image/png',
        })
        .expect(201);

      assert.match(uploaded.body.url, /^\/api\/uploads\/[0-9a-f-]+\.png$/);
      const filename = path.basename(uploaded.body.url);
      assert.deepEqual(
        await readFile(path.join(uploadsDirectory, filename)),
        png,
      );
      await request(app)
        .get(uploaded.body.url)
        .expect(200)
        .expect('Content-Type', 'image/png');

      for (const [filename, contentType, image] of [
        ['photo.jpg', 'image/jpeg', Buffer.from([0xff, 0xd8, 0xff, 0xd9])],
        ['photo.webp', 'image/webp', Buffer.from('RIFF0000WEBP', 'ascii')],
      ]) {
        await request(app)
          .post('/api/uploads')
          .set('Authorization', `Bearer ${token}`)
          .attach('file', image, { filename, contentType })
          .expect(201);
      }

      await request(app)
        .post('/api/uploads')
        .set('Authorization', `Bearer ${token}`)
        .attach(
          'file',
          Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
          {
            filename: 'logo.svg',
            contentType: 'image/svg+xml',
          },
        )
        .expect(201);
      const svgFile = (await readdir(uploadsDirectory)).find((file) =>
        file.endsWith('.svg'),
      );
      assert.ok(svgFile);
      await request(app)
        .get(`/api/uploads/${svgFile}`)
        .expect(200)
        .expect(
          'Content-Security-Policy',
          "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        );

      await request(app)
        .post('/api/uploads')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('not an image'), {
          filename: 'image.png',
          contentType: 'image/png',
        })
        .expect(400);
      await request(app)
        .post('/api/uploads')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('text'), {
          filename: 'file.txt',
          contentType: 'text/plain',
        })
        .expect(400);
      await request(app)
        .post('/api/uploads')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.alloc(5 * 1024 * 1024 + 1), {
          filename: 'large.png',
          contentType: 'image/png',
        })
        .expect(413);
    } finally {
      await rm(uploadsDirectory, { recursive: true, force: true });
    }
  });

  it('serves the API root, health check, and structured 404 responses', async () => {
    const { app } = createFixture();
    await request(app).get('/api').expect(200, 'Hello World!');
    const health = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173')
      .expect(200, { status: 'ok', database: 'connected' });
    assert.equal(
      health.headers['access-control-allow-origin'],
      'http://localhost:5173',
    );
    assert.equal(health.headers['x-powered-by'], undefined);
    assert.equal(health.headers['x-content-type-options'], 'nosniff');
    const missing = await request(app).get('/api/not-a-route').expect(404);
    assert.equal(missing.body.statusCode, 404);
    assert.equal(missing.body.error, 'Not Found');
    assert.equal(missing.body.message, 'Route not found.');
  });

  it('validates contact submissions and preserves the successful payload shape', async () => {
    const { app, prisma } = createFixture();
    const invalid = await request(app)
      .post('/api/contact')
      .send({ name: '', email: 'bad', message: '' })
      .expect(400);
    assert.equal(invalid.body.statusCode, 400);
    assert.equal(invalid.body.error, 'Bad Request');
    assert.ok(Array.isArray(invalid.body.message));

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Visitor',
        email: 'PERSON@EXAMPLE.COM',
        message: 'Hello',
        phone: '+1 555',
        company: 'Example Company',
        service: 'Web Development',
      })
      .expect(201);
    assert.equal(response.body.email, 'person@example.com');
    assert.equal(prisma.contactInquiry.rows.length, 1);

    const token = await registerAdmin(app);
    const updated = await request(app)
      .patch(`/api/contact/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'RESPONDED' })
      .expect(200);
    assert.equal(updated.body.status, 'RESPONDED');
    await request(app).delete(`/api/contact/${response.body.id}`).expect(401);
    await request(app)
      .delete(`/api/contact/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.equal(prisma.contactInquiry.rows.length, 0);
  });

  it('accepts contact submissions without optional fields', async () => {
    const { app, prisma } = createFixture();

    const response = await request(app)
      .post('/api/contact')
      .send({
        phone: '+1 555',
        company: 'Example Company',
        service: 'Web Development',
      })
      .expect(201);

    assert.equal(response.body.email, null);
    assert.equal(response.body.name, undefined);
    assert.equal(response.body.message, undefined);
    assert.equal(prisma.contactInquiry.rows.length, 1);
  });

  it('supports one-time admin setup, login, and active-account authorization', async () => {
    const { app, prisma } = createFixture();
    await request(app)
      .get('/api/auth/setup-status')
      .expect(200, { setupRequired: true });

    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Unauthorized',
        email: 'unauthorized@example.com',
        password: 'correct-horse',
        setupCode: 'wrong-setup-code-that-is-at-least-32-bytes',
      })
      .expect(403);

    const token = await registerAdmin(app);
    await request(app)
      .get('/api/auth/setup-status')
      .expect(200, { setupRequired: false });
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Second',
        email: 'second@example.com',
        password: 'long-enough-test-password',
        setupCode: config.adminSetupToken,
      })
      .expect(403);
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'correct-horse' })
      .expect(200);
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'wrong-password' })
      .expect(401);
    const dashboard = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.deepEqual(dashboard.body, {
      products: 1,
      activeServices: 1,
      projects: 2,
      testimonials: 2,
      newInquiries: 0,
      openJobs: 1,
      applications: 0,
    });

    prisma.admin.rows[0].isActive = false;
    await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('preserves public content filters and protects content management routes', async () => {
    const { app } = createFixture();
    const token = await registerAdmin(app);
    const authorization = { Authorization: `Bearer ${token}` };

    await request(app)
      .get('/api/services')
      .expect(200, [
        { id: 1, name: 'Live', slug: 'live', isActive: true, sortOrder: 1 },
      ]);
    await request(app)
      .get('/api/products')
      .expect(200, [
        { id: 1, name: 'Public product', isActive: true, sortOrder: 1 },
      ]);
    await request(app)
      .get('/api/portfolio')
      .expect(200, [
        {
          id: 1,
          title: 'Project',
          slug: 'project',
          featured: true,
          sortOrder: 1,
          categories: [],
          categoryIds: [],
        },
      ]);
    await request(app)
      .get('/api/testimonials')
      .expect(200, [
        { id: 1, quote: 'Featured', featured: true, sortOrder: 1 },
      ]);
    await request(app).get('/api/services/manage').expect(401);
    await request(app)
      .get('/api/services/manage')
      .set(authorization)
      .expect(200);

    const created = await request(app)
      .post('/api/services')
      .set(authorization)
      .send({ name: 'Cloud Services', features: ['Hosting'] })
      .expect(201);
    assert.equal(created.body.slug, 'cloud-services');
  });

  it('supports site settings and job application APIs with protected management', async () => {
    const { app, prisma } = createFixture();
    const token = await registerAdmin(app);
    const authorization = { Authorization: `Bearer ${token}` };

    await request(app)
      .get('/api/careers/openings')
      .expect(200, [
        { id: 1, jobTitle: 'Engineer', slug: 'engineer', status: 'OPEN' },
      ]);
    const application = await request(app)
      .post('/api/careers/applications')
      .send({
        jobOpeningId: 1,
        candidateName: 'Candidate',
        email: 'candidate@example.com',
      })
      .expect(201);
    assert.equal(application.body.coverLetter, undefined);
    assert.equal(application.body.resumeUrl, undefined);
    assert.equal(application.body.portfolioUrl, undefined);

    const linkedApplication = await request(app)
      .post('/api/careers/applications')
      .send({
        jobOpeningId: 1,
        candidateName: 'Candidate With Links',
        email: 'linked@example.com',
        resumeUrl: 'https://drive.google.com/file/d/example/view',
        portfolioUrl: 'https://example.com/work',
      })
      .expect(201);
    assert.equal(
      linkedApplication.body.resumeUrl,
      'https://drive.google.com/file/d/example/view',
    );
    assert.equal(
      linkedApplication.body.portfolioUrl,
      'https://example.com/work',
    );
    await request(app).get('/api/careers/applications').expect(401);
    await request(app)
      .get('/api/careers/applications')
      .set(authorization)
      .expect(200);
    const reviewedApplication = await request(app)
      .patch(`/api/careers/applications/${application.body.id}`)
      .set(authorization)
      .send({ status: 'REVIEWING' })
      .expect(200);
    assert.equal(reviewedApplication.body.status, 'REVIEWING');
    await request(app)
      .delete(`/api/careers/applications/${application.body.id}`)
      .expect(401);
    await request(app)
      .delete(`/api/careers/applications/${application.body.id}`)
      .set(authorization)
      .expect(200);
    assert.ok(
      !prisma.jobApplication.rows.some((row) => row.id === application.body.id),
    );

    await request(app)
      .get('/api/careers/manage')
      .set(authorization)
      .expect(200);
    await request(app)
      .post('/api/careers/applications')
      .send({
        jobOpeningId: 2,
        candidateName: 'Candidate',
        email: 'closed@example.com',
      })
      .expect(409);
    await request(app)
      .post('/api/careers/applications')
      .send({
        jobOpeningId: 999,
        candidateName: 'Candidate',
        email: 'missing@example.com',
      })
      .expect(404);

    await request(app).get('/api/settings/public').expect(200, {
      contactEmail: 'info@wmorgantech.com',
      contactPhone: '+91 88707 05554',
      contactLocation:
        'Dno - 333- F2, Geetha Building,\nNehru St, Peranaidu Layout,\nRam Nagar, Coimbatore,\nTamil Nadu 641009',
      workingHours: '',
      logoUrl: '',
      aboutImageUrl: '',
      aboutVideoUrl: '',
    });

    await request(app)
      .put('/api/admin/settings')
      .set(authorization)
      .send({
        contactEmail: 'hello@example.com',
        workingHours: 'Weekdays',
        logoUrl: '/api/uploads/site-logo.svg',
        aboutImageUrl: '/api/uploads/about.png',
        aboutVideoUrl: 'https://youtu.be/abcdefghijk',
      })
      .expect(200, {
        contactEmail: 'hello@example.com',
        contactPhone: '+91 88707 05554',
        contactLocation:
          'Dno - 333- F2, Geetha Building,\nNehru St, Peranaidu Layout,\nRam Nagar, Coimbatore,\nTamil Nadu 641009',
        workingHours: 'Weekdays',
        logoUrl: '/api/uploads/site-logo.svg',
        aboutImageUrl: '/api/uploads/about.png',
        aboutVideoUrl: 'https://youtu.be/abcdefghijk',
      });
    await request(app)
      .get('/api/admin/settings')
      .set(authorization)
      .expect(200, {
        contactEmail: 'hello@example.com',
        contactPhone: '+91 88707 05554',
        contactLocation:
          'Dno - 333- F2, Geetha Building,\nNehru St, Peranaidu Layout,\nRam Nagar, Coimbatore,\nTamil Nadu 641009',
        workingHours: 'Weekdays',
        logoUrl: '/api/uploads/site-logo.svg',
        aboutImageUrl: '/api/uploads/about.png',
        aboutVideoUrl: 'https://youtu.be/abcdefghijk',
      });
    await request(app).get('/api/settings/public').expect(200, {
      contactEmail: 'hello@example.com',
      contactPhone: '+91 88707 05554',
      contactLocation:
        'Dno - 333- F2, Geetha Building,\nNehru St, Peranaidu Layout,\nRam Nagar, Coimbatore,\nTamil Nadu 641009',
      workingHours: 'Weekdays',
      logoUrl: '/api/uploads/site-logo.svg',
      aboutImageUrl: '/api/uploads/about.png',
      aboutVideoUrl: 'https://youtu.be/abcdefghijk',
    });
    await request(app)
      .put('/api/admin/settings')
      .set(authorization)
      .send({ aboutVideoUrl: 'javascript:alert(1)' })
      .expect(400);
  });

  it('validates optional application URLs and accepts Google Drive resume links', async () => {
    const { app } = createFixture();
    const googleDriveApplication = await request(app)
      .post('/api/careers/applications')
      .send({
        jobOpeningId: 1,
        candidateName: 'Candidate With Drive Resume',
        email: 'drive@example.com',
        resumeUrl: 'https://drive.google.com/file/d/example/view',
        portfolioUrl: 'https://example.com/work',
      })
      .expect(201);
    assert.equal(
      googleDriveApplication.body.resumeUrl,
      'https://drive.google.com/file/d/example/view',
    );
    assert.equal(
      googleDriveApplication.body.portfolioUrl,
      'https://example.com/work',
    );

    await request(app)
      .post('/api/careers/applications')
      .send({
        jobOpeningId: 1,
        candidateName: 'Invalid Resume Link',
        email: 'invalid-resume@example.com',
        resumeUrl: 'javascript:alert(1)',
      })
      .expect(400);
    await request(app)
      .post('/api/careers/applications')
      .send({
        jobOpeningId: 1,
        candidateName: 'Invalid Portfolio Link',
        email: 'invalid-portfolio@example.com',
        portfolioUrl: 'not a URL',
      })
      .expect(400);
  });

  it('manages testimonials: optional quote, location, publish and unpublish', async () => {
    const { app } = createFixture();
    const token = await registerAdmin(app);
    const authorization = { Authorization: `Bearer ${token}` };

    // A client can be recorded without a quote; it starts unpublished.
    const noQuote = await request(app)
      .post('/api/testimonials')
      .set(authorization)
      .send({ authorName: 'Mr. Example', location: 'Coimbatore' })
      .expect(201);
    assert.equal(noQuote.body.location, 'Coimbatore');
    assert.equal(noQuote.body.featured, undefined);

    // authorName stays mandatory, and unknown fields are still rejected.
    await request(app)
      .post('/api/testimonials')
      .set(authorization)
      .send({ location: 'Coimbatore' })
      .expect(400);
    await request(app)
      .post('/api/testimonials')
      .set(authorization)
      .send({ authorName: 'Someone', rating: 5 })
      .expect(400);
    await request(app)
      .post('/api/testimonials')
      .set(authorization)
      .send({ authorName: 'x'.repeat(161) })
      .expect(400);

    const idsPublic = async () =>
      (await request(app).get('/api/testimonials').expect(200)).body.map(
        (row) => row.id,
      );

    // Unpublished records never reach the public API.
    assert.ok(!(await idsPublic()).includes(noQuote.body.id));

    // Publishing makes the latest saved values public immediately.
    await request(app)
      .patch(`/api/testimonials/${noQuote.body.id}`)
      .set(authorization)
      .send({ featured: true, quote: 'Added later', location: 'Salem' })
      .expect(200);
    const published = (await request(app).get('/api/testimonials').expect(200))
      .body;
    const row = published.find((item) => item.id === noQuote.body.id);
    assert.equal(row.quote, 'Added later');
    assert.equal(row.location, 'Salem');

    // Unpublishing hides it again; the record is kept for Admin.
    await request(app)
      .patch(`/api/testimonials/${noQuote.body.id}`)
      .set(authorization)
      .send({ featured: false })
      .expect(200);
    assert.ok(!(await idsPublic()).includes(noQuote.body.id));
    const managed = await request(app)
      .get('/api/testimonials/manage')
      .set(authorization)
      .expect(200);
    assert.ok(managed.body.some((item) => item.id === noQuote.body.id));

    // Deleting removes it everywhere.
    await request(app)
      .patch(`/api/testimonials/${noQuote.body.id}`)
      .set(authorization)
      .send({ featured: true })
      .expect(200);
    await request(app)
      .delete(`/api/testimonials/${noQuote.body.id}`)
      .set(authorization)
      .expect(200);
    assert.ok(!(await idsPublic()).includes(noQuote.body.id));
  });

  it('manages team members: protected CRUD, validation and publishing', async () => {
    const { app } = createFixture();
    const token = await registerAdmin(app);
    const authorization = { Authorization: `Bearer ${token}` };
    const profile = {
      name: 'Test Member',
      designation: 'Engineer',
      memberType: 'INTERN',
      skills: ['Frontend: React, CSS'],
      published: false,
    };

    // Every write endpoint and the management list need an admin token.
    await request(app).post('/api/team').send(profile).expect(401);
    await request(app).get('/api/team/manage').expect(401);
    await request(app).patch('/api/team/1').send({ name: 'x' }).expect(401);
    await request(app).delete('/api/team/1').expect(401);

    // Validation: required fields, allowed group, unknown fields.
    await request(app)
      .post('/api/team')
      .set(authorization)
      .send({ name: 'No designation' })
      .expect(400);
    await request(app)
      .post('/api/team')
      .set(authorization)
      .send({ ...profile, memberType: 'BOSS' })
      .expect(400);
    await request(app)
      .post('/api/team')
      .set(authorization)
      .send({ ...profile, salary: 1 })
      .expect(400);

    const created = await request(app)
      .post('/api/team')
      .set(authorization)
      .send(profile)
      .expect(201);
    const id = created.body.id;

    // Unpublished profiles are hidden from the list and from /api/team/:id.
    const publicIds = async () =>
      (await request(app).get('/api/team').expect(200)).body.map((r) => r.id);
    assert.ok(!(await publicIds()).includes(id));
    await request(app).get(`/api/team/${id}`).expect(404);
    await request(app).get('/api/team/abc').expect(400);

    await request(app)
      .patch(`/api/team/${id}`)
      .set(authorization)
      .send({ published: true, experience: 'Verified text' })
      .expect(200);
    assert.ok((await publicIds()).includes(id));
    const detail = await request(app).get(`/api/team/${id}`).expect(200);
    assert.equal(detail.body.experience, 'Verified text');

    await request(app)
      .patch(`/api/team/${id}`)
      .set(authorization)
      .send({ published: false })
      .expect(200);
    await request(app).get(`/api/team/${id}`).expect(404);
    const managed = await request(app)
      .get('/api/team/manage')
      .set(authorization)
      .expect(200);
    assert.ok(managed.body.some((row) => row.id === id));

    await request(app).delete(`/api/team/${id}`).set(authorization).expect(200);
    await request(app).get(`/api/team/${id}`).expect(404);
  });

  it('saves a project client logo separately from its cover image', async () => {
    const { app } = createFixture();
    const token = await registerAdmin(app);
    const authorization = { Authorization: `Bearer ${token}` };

    const project = await request(app)
      .post('/api/portfolio')
      .set(authorization)
      .send({
        title: 'Logo Project',
        coverImage: '/api/uploads/cover.png',
        clientLogo: '/api/uploads/logo.png',
        featured: true,
      })
      .expect(201);
    assert.equal(project.body.coverImage, '/api/uploads/cover.png');
    assert.equal(project.body.clientLogo, '/api/uploads/logo.png');

    // Changing the logo leaves the cover image alone, and the public API returns both.
    await request(app)
      .patch(`/api/portfolio/${project.body.id}`)
      .set(authorization)
      .send({ clientLogo: '/api/uploads/logo-2.png' })
      .expect(200);
    const published = (await request(app).get('/api/portfolio').expect(200))
      .body;
    const row = published.find((item) => item.id === project.body.id);
    assert.equal(row.coverImage, '/api/uploads/cover.png');
    assert.equal(row.clientLogo, '/api/uploads/logo-2.png');

    // Still protected, still length-limited, and optional.
    await request(app)
      .post('/api/portfolio')
      .send({ title: 'x', clientLogo: '/a.png' })
      .expect(401);
    await request(app)
      .post('/api/portfolio')
      .set(authorization)
      .send({ title: 'Too long', clientLogo: 'x'.repeat(2049) })
      .expect(400);
    await request(app)
      .post('/api/portfolio')
      .set(authorization)
      .send({ title: 'No logo' })
      .expect(201);
  });

  it('manages ordered portfolio categories and project assignments', async () => {
    const { app } = createFixture();
    const token = await registerAdmin(app);
    const authorization = { Authorization: 'Bearer ' + token };

    await request(app).get('/api/portfolio-categories/manage').expect(401);
    const web = await request(app)
      .post('/api/portfolio-categories')
      .set(authorization)
      .send({ name: 'Web Platforms', sortOrder: 2, isActive: true })
      .expect(201);
    const mobile = await request(app)
      .post('/api/portfolio-categories')
      .set(authorization)
      .send({ name: 'Mobile', sortOrder: 1, isActive: true })
      .expect(201);
    assert.equal(web.body.slug, 'web-platforms');
    assert.deepEqual(
      (
        await request(app).get('/api/portfolio-categories').expect(200)
      ).body.map(({ name }) => name),
      ['Mobile', 'Web Platforms'],
    );

    const project = await request(app)
      .post('/api/portfolio')
      .set(authorization)
      .send({
        title: 'Ordered project',
        featured: true,
        sortOrder: 0,
        categoryIds: [web.body.id],
      })
      .expect(201);
    assert.deepEqual(project.body.categoryIds, [web.body.id]);
    assert.equal(project.body.categories[0].name, 'Web Platforms');
    assert.equal(
      (await request(app).get('/api/portfolio').expect(200)).body[0].id,
      project.body.id,
    );

    const updated = await request(app)
      .patch('/api/portfolio/' + project.body.id)
      .set(authorization)
      .send({ categoryIds: [mobile.body.id], sortOrder: 3 })
      .expect(200);
    assert.deepEqual(updated.body.categoryIds, [mobile.body.id]);
    assert.equal(updated.body.sortOrder, 3);
    assert.equal(
      (await request(app).get('/api/portfolio').expect(200)).body[0].id,
      1,
    );

    await request(app)
      .patch('/api/portfolio/' + project.body.id)
      .set(authorization)
      .send({ categoryIds: ['not-an-id'] })
      .expect(400);
    await request(app)
      .patch('/api/portfolio/' + project.body.id)
      .set(authorization)
      .send({ sortOrder: -1 })
      .expect(400);
    await request(app)
      .patch('/api/portfolio-categories/' + web.body.id)
      .set(authorization)
      .send({ isActive: false })
      .expect(200);
    assert.deepEqual(
      (
        await request(app).get('/api/portfolio-categories').expect(200)
      ).body.map(({ name }) => name),
      ['Mobile'],
    );
  });

  it('supports protected product, project, testimonial, and opening CRUD', async () => {
    const { app, prisma } = createFixture();
    const token = await registerAdmin(app);
    const authorization = { Authorization: `Bearer ${token}` };

    const product = await request(app)
      .post('/api/products')
      .set(authorization)
      .send({
        name: 'Analytics',
        category: 'Business',
        description: 'Business analytics',
      })
      .expect(201);
    assert.equal(product.body.slug, 'analytics');
    const updatedProduct = await request(app)
      .patch(`/api/products/${product.body.id}`)
      .set(authorization)
      .send({ name: 'Analytics Suite' })
      .expect(200);
    assert.equal(updatedProduct.body.slug, 'analytics-suite');
    await request(app)
      .delete(`/api/products/${product.body.id}`)
      .set(authorization)
      .expect(200);

    const project = await request(app)
      .post('/api/portfolio')
      .set(authorization)
      .send({ title: 'New Project', tags: ['Web'] })
      .expect(201);
    assert.equal(project.body.slug, 'new-project');
    await request(app)
      .patch(`/api/portfolio/${project.body.id}`)
      .set(authorization)
      .send({ featured: true })
      .expect(200);
    await request(app)
      .delete(`/api/portfolio/${project.body.id}`)
      .set(authorization)
      .expect(200);

    const testimonial = await request(app)
      .post('/api/testimonials')
      .set(authorization)
      .send({
        quote: 'Excellent work',
        authorName: 'Client',
        featured: true,
      })
      .expect(201);
    assert.equal(testimonial.body.authorName, 'Client');
    await request(app)
      .patch(`/api/testimonials/${testimonial.body.id}`)
      .set(authorization)
      .send({ quote: 'Great work' })
      .expect(200);
    await request(app)
      .delete(`/api/testimonials/${testimonial.body.id}`)
      .set(authorization)
      .expect(200);

    const opening = await request(app)
      .post('/api/careers')
      .set(authorization)
      .send({
        jobTitle: 'Designer',
        employmentType: 'FULL_TIME',
        description: 'Design user experiences',
      })
      .expect(201);
    assert.equal(opening.body.slug, 'designer');
    const application = await request(app)
      .post('/api/careers/applications')
      .send({
        jobOpeningId: opening.body.id,
        candidateName: 'Candidate',
        email: 'candidate@example.com',
      })
      .expect(201);
    await request(app)
      .delete(`/api/careers/${opening.body.id}`)
      .set(authorization)
      .expect(409);
    assert.ok(
      prisma.jobApplication.rows.some((row) => row.id === application.body.id),
    );
    await request(app)
      .patch(`/api/careers/${opening.body.id}`)
      .set(authorization)
      .send({ status: 'CLOSED' })
      .expect(200);
    await request(app)
      .post('/api/careers/applications')
      .send({
        jobOpeningId: opening.body.id,
        candidateName: 'Candidate Two',
        email: 'candidate2@example.com',
      })
      .expect(409);
    await request(app)
      .delete(`/api/careers/${opening.body.id}`)
      .set(authorization)
      .expect(409);
  });

  it('limits repeated public contact submissions with the standard error contract', async () => {
    const { app } = createFixture();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await request(app)
        .post('/api/contact')
        .send({
          name: 'Visitor',
          email: `visitor${attempt}@example.com`,
          message: 'Hello',
          phone: '+1 555',
          company: 'Example Company',
          service: 'Web Development',
        })
        .expect(201);
    }
    const limited = await request(app)
      .post('/api/contact')
      .send({
        name: 'Visitor',
        email: 'visitor6@example.com',
        message: 'Hello',
        phone: '+1 555',
        company: 'Example Company',
        service: 'Web Development',
      })
      .expect(429);
    assert.equal(limited.body.statusCode, 429);
    assert.equal(limited.body.error, 'Too Many Requests');
    assert.equal(typeof limited.body.message, 'string');
  });
});
