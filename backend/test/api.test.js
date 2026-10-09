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
        const [field, direction] = Object.entries(orderBy)[0];
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
  const testimonials = createModel([
    { id: 1, quote: 'Featured', featured: true, sortOrder: 1 },
    { id: 2, quote: 'Unfeatured', featured: false, sortOrder: 2 },
  ]);
  const contactInquiries = createModel();
  const jobOpenings = createModel([
    { id: 1, jobTitle: 'Engineer', slug: 'engineer', status: 'OPEN' },
    { id: 2, jobTitle: 'Closed role', slug: 'closed-role', status: 'CLOSED' },
  ]);
  const jobApplications = createModel();

  const prisma = {
    admin: admins,
    service: services,
    product: products,
    project: projects,
    testimonial: testimonials,
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
      projects: 1,
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
    const { app } = createFixture();
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

    await request(app)
      .put('/api/admin/settings')
      .set(authorization)
      .send({
        contactEmail: 'hello@example.com',
        workingHours: 'Weekdays',
        logoUrl: '/api/uploads/site-logo.svg',
      })
      .expect(200, {
        contactEmail: 'hello@example.com',
        contactPhone: '+91 88707 05554',
        contactLocation:
          'Dno - 333-F2, Geetha Building,\nNehru St, Peranaidu Layout,\nRam Nagar, Coimbatore,\nTamil Nadu 641009',
        workingHours: 'Weekdays',
        logoUrl: '/api/uploads/site-logo.svg',
      });
    await request(app)
      .get('/api/admin/settings')
      .set(authorization)
      .expect(200, {
        contactEmail: 'info@wmorgantech.com',
        contactPhone: '+91 88707 05554',
        contactLocation:
          'Dno - 333-F2, Geetha Building,\nNehru St, Peranaidu Layout,\nRam Nagar, Coimbatore,\nTamil Nadu 641009',
        workingHours: 'Weekdays',
        logoUrl: '/api/uploads/site-logo.svg',
      });
    await request(app).get('/api/settings/public').expect(200, {
      contactEmail: 'info@wmorgantech.com',
      contactPhone: '+91 88707 05554',
      contactLocation:
        'Dno - 333-F2, Geetha Building,\nNehru St, Peranaidu Layout,\nRam Nagar, Coimbatore,\nTamil Nadu 641009',
      workingHours: 'Weekdays',
      logoUrl: '/api/uploads/site-logo.svg',
    });
  });

  it('supports protected product, project, testimonial, and opening CRUD', async () => {
    const { app } = createFixture();
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
        })
        .expect(201);
    }
    const limited = await request(app)
      .post('/api/contact')
      .send({
        name: 'Visitor',
        email: 'visitor6@example.com',
        message: 'Hello',
      })
      .expect(429);
    assert.equal(limited.body.statusCode, 429);
    assert.equal(limited.body.error, 'Too Many Requests');
    assert.equal(typeof limited.body.message, 'string');
  });
});
