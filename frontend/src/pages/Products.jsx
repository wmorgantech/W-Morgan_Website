import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Users,
  ShoppingCart,
  BrainCircuit,
  Check,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPublicProducts } from "../lib/api";
import { projectFallbackImages } from "../lib/projectImages";
import { EmptyState, ErrorState, LoadingState } from "../components/common/DataState";
import FinalCTASection from "../components/sections/FinalCTASection";
import heroImg from "../assets/img9.jpeg";

const ease = [0.22, 1, 0.36, 1];

const iconMap = {
  Users,
  BarChart3,
  ShoppingCart,
  BrainCircuit,
  Layers,
};

function ProductCard({ product, index, featured }) {
  const Icon = product.icon || Layers;
  const image = projectFallbackImages[(index + 2) % projectFallbackImages.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 2) * 0.06, duration: 0.5, ease }}
      className={`spot group flex overflow-hidden rounded-2xl border bg-white transition-all duration-500 hover:-translate-y-0.5 hover:border-[#176b4d]/40 hover:shadow-[0_28px_60px_-32px_rgba(8,18,13,0.5)] ${
        featured
          ? "flex-col border-[#0d1b14] bg-[#0d1b14] text-white sm:col-span-2 md:flex-row"
          : "flex-col border-[#0e1411]/10"
      }`}
    >
      {/* visual band */}
      <div
        className={`frame relative shrink-0 !rounded-none !border-0 ${
          featured ? "h-48 md:h-auto md:w-[44%]" : "h-40"
        }`}
      >
        <img src={image} alt="" loading="lazy" />
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-t ${
            featured ? "from-[#0d1b14]/70 md:bg-gradient-to-r md:from-transparent md:to-[#0d1b14]" : "from-[#08120d]/60"
          } via-transparent to-transparent`}
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#0d1b14]/60 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
          <Icon size={12} strokeWidth={1.8} className="text-[#7be0b4]" />
          {product.category}
        </span>
        <span className="absolute bottom-3 right-4 font-mono text-xs text-white/70">
          {product.number}
        </span>
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-7">
        <div>
          <h3
            className={`font-semibold tracking-tight ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}
          >
            {product.name}
          </h3>

          <p
            className={`mt-2.5 text-[14px] leading-7 ${
              featured ? "max-w-md text-white/65" : "text-[#5c655f]"
            }`}
          >
            {product.description}
          </p>
        </div>

        <div className="mt-6">
          {product.features.length > 0 && (
            <>
              <p className={`mono-label ${featured ? "text-white/40" : "text-[#0e1411]/40"}`}>
                Core Modules
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {product.features.map((feat) => (
                  <li key={feat} className={`pill ${featured ? "pill-dark" : ""}`}>
                    <Check size={11} className={featured ? "text-[#7be0b4]" : "text-[#2faa7d]"} />
                    {feat}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div
            className={`mt-6 flex items-center justify-between border-t pt-4 ${
              featured ? "border-white/10" : "border-[#0e1411]/10"
            }`}
          >
            <Link
              to="/contact"
              className={`group/link inline-flex items-center gap-1.5 text-[13px] font-semibold ${
                featured ? "text-white" : "text-[#0e1411]"
              }`}
            >
              Request Demo
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 group-hover/link:rotate-45 ${
                  featured
                    ? "bg-[#7be0b4] text-[#0d1b14]"
                    : "bg-[#0d1b14] text-white group-hover/link:bg-[#176b4d]"
                }`}
              >
                <ArrowUpRight size={13} />
              </span>
            </Link>

            <span
              className={`font-mono text-[10px] ${featured ? "text-white/35" : "text-[#0e1411]/35"}`}
            >
              WM_PRODUCT
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Products() {
  const [productList, setProductList] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetchPublicProducts()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The products response was not a list.");
        }

        const mapped = data.map((item, idx) => ({
          ...item,
          id: item.id,
          number: String(idx + 1).padStart(2, "0"),
          name: item.name,
          category: item.category ? item.category.toUpperCase() : "SOFTWARE PRODUCT",
          description: item.description,
          icon: iconMap[item.category] || Layers,
          features: Array.isArray(item.features) ? item.features : [],
        }));

        if (active) {
          setProductList(mapped);
          setStatus(mapped.length ? "ready" : "empty");
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error.message || "Products could not be loaded.");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Feature the first product on its own row when the rest still pair up evenly.
  const hasFeatured = productList.length > 0 && productList.length % 2 === 1;

  return (
    <div className="overflow-hidden bg-[#f6f6f1] text-[#0e1411]">
      {/* HERO */}
      <section className="surface-dark on-dark">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease }}
                className="eyebrow eyebrow-light"
              >
                Product Suite
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease }}
                className="display mt-6 text-[clamp(2.4rem,5vw,4rem)] leading-[1] text-white"
              >
                Products
                <br />
                <span className="text-[#ff3b30]">built for real work.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.14, ease }}
                className="lead mt-6 max-w-md"
              >
                Modular, high-performance software platforms built to solve everyday business
                operations, customer management, analytics, and automation.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease }}
              className="relative"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(47,170,125,0.25),transparent)] blur-2xl"
              />
              <div className="frame frame-ring aspect-[16/10] rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
                <img src={heroImg} alt="" />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#08120d]/50 via-transparent to-transparent"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {status === "loading" && <LoadingState label={"Loading products..."} variant="cards" />}
          {status === "error" && <ErrorState message={errorMessage} />}
          {status === "empty" && <EmptyState message={"No products are available right now."} />}

          {status === "ready" && (
            <div className="grid gap-5 sm:grid-cols-2">
              {productList.map((product, index) => (
                <ProductCard
                  key={product.id || product.number}
                  product={product}
                  index={index}
                  featured={hasFeatured && index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <FinalCTASection />
    </div>
  );
}
