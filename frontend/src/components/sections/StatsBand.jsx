import Counter from '@/components/common/Counter';
import { stats } from '@/data/stats';

function StatsBand() {
  return (
    <section className="border-y border-border bg-white py-8 md:py-10">
      <div className="shell">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group flex flex-col items-start gap-2 border-l border-border pl-4 transition-colors duration-500 hover:border-accent"
            >
              <stat.icon
                className="h-5 w-5 text-brand transition-colors duration-500 group-hover:text-accent"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <div>
                <p className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs leading-5 text-muted sm:text-[13px]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsBand;
