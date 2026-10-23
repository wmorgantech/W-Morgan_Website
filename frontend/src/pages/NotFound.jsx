import Button from "../components/common/Button";
import Reveal from "../components/common/Reveal";
import { usePageMeta } from "../hooks/usePageMeta";
import { paths } from "../routes/paths";

function NotFound() {
  usePageMeta({
    title: "Page not found",
    description: "The page you are looking for does not exist or may have been moved.",
    noindex: true,
  });

  return (
    <main className="surface-dark aurora on-dark relative px-5 py-24 sm:px-8 md:py-36">
      <span aria-hidden="true" className="grain-overlay" />
      <span
        aria-hidden="true"
        className="rings absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 sm:h-[32rem] sm:w-[32rem]"
      />
      <Reveal className="relative mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="outline-num font-serif text-[7rem] italic leading-none [--num:rgba(123,224,180,0.7)] md:text-[10rem]">
          404
        </p>
        <h1 className="display mt-4 text-[clamp(1.9rem,3.6vw,2.8rem)] text-white">Page not found</h1>
        <p className="lead mt-4 max-w-md">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8">
          <Button href={paths.home} arrow variant="light">
            Back to Home
          </Button>
        </div>
      </Reveal>
    </main>
  );
}

export default NotFound;
