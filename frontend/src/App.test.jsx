import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const remainingNavLabels = ["Home", "About Us", "Services", "Portfolio", "Career", "Contact Us"];

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input) => {
      const data = String(input).includes("/settings/public")
        ? { aboutImageUrl: "", aboutVideoUrl: "" }
        : [];
      return { ok: true, json: async () => data };
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App shell', () => {
  it('renders the requested homepage content and remaining public navigation in order', async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Technology That Understands Your Business. Engineering Solutions. Enabling Growth.",
    );
    expect(screen.getByText("15+")).toBeInTheDocument();
    expect(screen.getByText("Years of Experience")).toBeInTheDocument();
    expect(screen.getByText("100+")).toBeInTheDocument();
    expect(screen.getByText("Projects Done")).toBeInTheDocument();
    expect(screen.getByText("10+")).toBeInTheDocument();
    expect(screen.getByText("Technologies")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("Trusted Clients")).toBeInTheDocument();
    expect(await screen.findByText("What We Do")).toBeInTheDocument();
    expect(await screen.findByText("No services are published yet.")).toBeInTheDocument();
    expect(screen.queryByText("Web Application Development")).not.toBeInTheDocument();
    expect(screen.getByText("Technology in Action")).toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Primary navigation" }))
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(remainingNavLabels);
    expect(
      within(screen.getByRole("navigation", { name: "Footer navigation" }))
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(remainingNavLabels);
  });

  it('shows the same remaining links in the mobile menu', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(
      within(mobileNavigation)
        .getAllByRole("link")
        .filter((link) => /^\d{2}/.test(link.textContent.trim()))
        .map((link) => link.textContent.replace(/^\d+/, "").trim()),
    ).toEqual(remainingNavLabels);
    expect(mobileNavigation.querySelector(".text-\\[1\\.25rem\\]")).toBeInTheDocument();
    expect(mobileNavigation.parentElement).toHaveClass(
      "h-[calc(100dvh-72px)]",
      "absolute",
      "top-full",
    );
  });

  it.each(["/products", "/team", "/team/1"])(
    'does not expose the removed public route %s',
    (path) => {
      render(
        <MemoryRouter
          initialEntries={[path]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <App />
        </MemoryRouter>,
      );

      expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
    },
  );
});
