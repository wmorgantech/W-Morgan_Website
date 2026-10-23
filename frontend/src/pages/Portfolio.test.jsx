import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPublicPortfolio, fetchPublicPortfolioCategories } from "../lib/api";
import Portfolio from "./Portfolio";

vi.mock("../lib/api", () => ({
  fetchPublicPortfolio: vi.fn(),
  fetchPublicPortfolioCategories: vi.fn(),
}));

describe("Portfolio page filters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchPublicPortfolio.mockResolvedValue([
      {
        id: 1,
        title: "Cloud platform",
        summary: "A published cloud solution.",
        featured: true,
        categories: [{ id: 1, name: "Cloud Systems" }],
        tags: ["React"],
      },
      {
        id: 2,
        title: "Commerce platform",
        summary: "A published commerce solution.",
        featured: true,
        categories: [{ id: 2, name: "Commerce" }],
        tags: ["Node.js"],
      },
    ]);
    fetchPublicPortfolioCategories.mockResolvedValue([
      { id: 1, name: "Cloud Systems", sortOrder: 1, isActive: true },
      { id: 2, name: "Commerce", sortOrder: 2, isActive: true },
      { id: 3, name: "Unused category", sortOrder: 3, isActive: true },
    ]);
  });

  it("uses managed categories dynamically and filters projects by assignment", async () => {
    render(
      <MemoryRouter>
        <Portfolio />
      </MemoryRouter>,
    );

    const categoryFilter = await screen.findByRole("button", { name: "Cloud Systems" });
    expect(screen.getByRole("button", { name: "Commerce" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Unused category" })).not.toBeInTheDocument();

    fireEvent.click(categoryFilter);

    expect(await screen.findByRole("button", { name: "View details: Cloud platform" }))
      .toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "View details: Commerce platform" }))
        .not.toBeInTheDocument();
    });
  });
});
