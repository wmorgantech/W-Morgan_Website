import { motion } from "framer-motion";
import Button from "../components/common/Button";
import { usePageMeta } from "../hooks/usePageMeta";
import { paths } from "../routes/paths";

function NotFound() {
  usePageMeta({
    title: "Page not found",
    description: "The page you are looking for does not exist or may have been moved.",
    noindex: true,
  });

  return (
    <main className="bg-[#f6f6f1] px-5 py-20 sm:px-8 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-xl flex-col items-center text-center"
      >
        <p className="font-serif text-[6rem] italic leading-none text-[#176b4d]/80 md:text-[8rem]">
          404
        </p>
        <h1 className="display mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)]">Page not found</h1>
        <p className="lead mt-4 max-w-md">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8">
          <Button href={paths.home} arrow>
            Back to Home
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

export default NotFound;
