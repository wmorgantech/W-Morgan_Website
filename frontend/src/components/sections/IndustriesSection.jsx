import {
  ShoppingBag,
  ShoppingCart,
  Landmark,
  HeartPulse,
  Users,
  GraduationCap,
  Factory,
  Truck,
  Home,
  BriefcaseBusiness,
} from "lucide-react";
import Reveal from "../common/Reveal";

const industries = [
  { name: "Retail", icon: ShoppingBag, tag: "Omnichannel & POS" },
  { name: "Finance", icon: Landmark, tag: "Secured Systems" },
  { name: "Healthcare", icon: HeartPulse, tag: "Compliance & EHR" },
  { name: "CRM", icon: Users, tag: "Customer Lifecycle" },
  { name: "E-commerce", icon: ShoppingCart, tag: "Custom Storefronts" },
  { name: "Education", icon: GraduationCap, tag: "LMS & Platforms" },
  { name: "Manufacturing", icon: Factory, tag: "ERP & Automation" },
  { name: "HR", icon: BriefcaseBusiness, tag: "Payroll & Talent" },
  { name: "Logistics", icon: Truck, tag: "Fleet & Tracking" },
  { name: "Real Estate", icon: Home, tag: "Property Portals" },
];

/** Ten industries in one static, compact grid. */
function IndustriesSection() {
  return (
    <section className="bg-[#f6f6f1] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Industries</p>
            <h2 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.3rem)] text-[#0e1411]">
              Digital solutions <span className="text-[#176b4d]">for every industry.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#5c655f]">
            Technology designed around the operational workflows of each sector.
          </p>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <Reveal
                as="li"
                key={industry.name}
                y={10}
                delay={(index % 5) * 0.04}
                className="group flex items-center gap-3 rounded-xl border border-[#0e1411]/10 bg-white px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#176b4d]/45 hover:bg-[#0d1b14]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e6f0ea] text-[#176b4d] transition-colors duration-300 group-hover:bg-[#176b4d] group-hover:text-white">
                  <Icon size={17} strokeWidth={1.6} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold tracking-tight text-[#0e1411] transition-colors duration-300 group-hover:text-white">
                    {industry.name}
                  </span>
                  <span className="block truncate text-[11.5px] text-[#5c655f] transition-colors duration-300 group-hover:text-white/60">
                    {industry.tag}
                  </span>
                </span>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default IndustriesSection;
