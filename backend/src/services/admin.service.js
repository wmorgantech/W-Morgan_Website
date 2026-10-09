const DEFAULT_PUBLIC_SETTINGS = {
  contactEmail: 'info@wmorgantech.com',
  contactPhone: '+91 88707 05554',
  contactLocation:
    'Dno - 333-F2, Geetha Building,\nNehru St, Peranaidu Layout,\nRam Nagar, Coimbatore,\nTamil Nadu 641009',
  workingHours: 'Mon – Sat · 9:00 AM – 6:00 PM',
  logoUrl: '',
};

async function getDashboardSummary(prisma) {
  const [
    products,
    activeServices,
    projects,
    testimonials,
    newInquiries,
    openJobs,
    applications,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.project.count(),
    prisma.testimonial.count(),
    prisma.contactInquiry.count({ where: { status: 'NEW' } }),
    prisma.jobOpening.count({ where: { status: 'OPEN' } }),
    prisma.jobApplication.count(),
  ]);

  return {
    products,
    activeServices,
    projects,
    testimonials,
    newInquiries,
    openJobs,
    applications,
  };
}

async function getSettings(prisma) {
  const settings = await prisma.siteSetting.findMany();
  return {
    ...DEFAULT_PUBLIC_SETTINGS,
    ...Object.fromEntries(settings.map(({ key, value }) => [key, value])),
  };
}

async function getPublicSettings(prisma) {
  const settings = await getSettings(prisma);
  return Object.fromEntries(
    Object.keys(DEFAULT_PUBLIC_SETTINGS).map((key) => [key, settings[key]]),
  );
}

async function updateSettings(prisma, dto) {
  const entries = Object.entries(dto);
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      }),
    ),
  );
  return getSettings(prisma);
}

module.exports = {
  DEFAULT_PUBLIC_SETTINGS,
  getDashboardSummary,
  getSettings,
  getPublicSettings,
  updateSettings,
};
