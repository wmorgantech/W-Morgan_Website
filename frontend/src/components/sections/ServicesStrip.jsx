import { Code2, Cloud, BrainCircuit, Smartphone, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Code2,
    title: 'Custom Software Development',
    description: 'Scalable, secure and high-performance software tailored to your business.',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Migrate, modernize and manage cloud infrastructure with security and efficiency.',
  },
  {
    icon: BrainCircuit,
    title: 'AI & Automation',
    description: 'Intelligent automation and AI solutions to optimize processes and drive growth.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'User-friendly mobile apps for iOS, Android and cross-platform experiences.',
  },
  {
    icon: BarChart3,
    title: 'Data & Analytics',
    description: 'Transform your data into actionable insights and make smarter business decisions.',
  },
];

function ServicesStrip() {
  return (
    <div className="relative z-10 bg-[#f5f5f0] pb-4">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-white shadow-soft-lg sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-4 p-6 transition-colors duration-500 hover:bg-[#f5f5f0] lg:p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand transition-all duration-500 group-hover:bg-brand group-hover:text-white">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold leading-snug text-foreground">{feature.title}</p>
              <p className="text-[13px] leading-6 text-muted">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default ServicesStrip;
