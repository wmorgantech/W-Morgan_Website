import Container from '../components/common/Container';

function NotFound() {
  return (
    <Container className="py-10 lg:py-14">
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-3 max-w-md text-muted">The page you are looking for does not exist or may have been moved.</p>
      </div>
    </Container>
  );
}

export default NotFound;
