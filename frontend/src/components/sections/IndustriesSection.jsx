import { motion } from "framer-motion";
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
import SectionTitle from "../common/SectionTitle";

const ease = [0.22, 1, 0.36, 1];

const industries = [
  { id: "01", name: "Retail", icon: ShoppingBag, tag: "Omnichannel & POS" },
  { id: "02", name: "Finance", icon: Landmark, tag: "Secured Systems" },
  { id: "03", name: "Healthcare", icon: HeartPulse, tag: "Compliance & EHR" },
  { id: "04", name: "CRM", icon: Users, tag: "Customer Lifecycle" },
  { id: "05", name: "E-commerce", icon: ShoppingCart, tag: "Custom Storefronts" },
  { id: "06", name: "Education", icon: GraduationCap, tag: "LMS & Platforms" },
  { id: "07", name: "Manufacturing", icon: Factory, tag: "ERP & Automation" },
  { id: "08", name: "HR", icon: BriefcaseBusiness, tag: "Payroll & Talent" },
  { id: "09", name: "Logistics", icon: Truck, tag: "Fleet & Tracking" },
  { id: "10", name: "Real Estate", icon: Home, tag: "Property Portals" },
];

function IndustriesSection() {
  return (
    <section className="bg-[#f6f6f1] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-10 grid gap-5 md:mb-12 md:grid-cols-[1fr_auto] md:items-end">
          <SectionTitle
            eyebrow="Industries"
            title={
              <>
                Digital solutions{" "}
                <span className="text-[#ff3b30]">for every industry.</span>
              </>
            }
          />
          <p className="lead max-w-sm">
            Targeted technology designed around the specific operational workflows of each sector.
          </p>
        </div>

        {/* One connected index: hairline-divided cells that flood with forest green on hover */}
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#0e1411]/10 bg-white sm:grid-cols-3 lg:grid-cols-5">
          {industries.map((industry, index) => {
            const Icon = industry.icon;

            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 5) * 0.04, duration: 0.4, ease }}
                className="group relative -mb-px -mr-px flex min-h-[168px] flex-col justify-between border-b border-r border-[#0e1411]/10 p-5 transition-colors duration-300 hover:bg-[#0d1b14]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-[#176b4d] transition-colors duration-300 group-hover:text-[#7be0b4]">
                    {industry.id}
                  </span>
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-[#0e1411]/70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-[#7be0b4]"
                  />
                </div>

                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-[#0e1411] transition-colors duration-300 group-hover:text-white">
                    {industry.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#5c655f] transition-colors duration-300 group-hover:text-white/60">
                    {industry.tag}
                  </p>
                  <span className="mt-3 block h-0.5 w-6 rounded-full bg-[#2faa7d] transition-all duration-500 group-hover:w-12 group-hover:bg-[#7be0b4]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default IndustriesSection;
