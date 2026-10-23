import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPublicTestimonials } from "../../lib/api";
import TestimonialsSection from "./TestimonialsSection";

vi.mock("../../lib/api", () => ({
  fetchPublicTestimonials: vi.fn(),
}));

function renderSection() {
  return render(
    <MemoryRouter>
      <TestimonialsSection />
    </MemoryRouter>,
  );
}

describe("TestimonialsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows published testimonials in an interactive carousel only", async () => {
    fetchPublicTestimonials.mockResolvedValue([
      {
        id: 1,
        authorName: "Asha Client",
        company: "Asha Co.",
        quote: "The first published story.",
        featured: true,
      },
      {
        id: 2,
        authorName: "Ravi Client",
        quote: "The next published story.",
        featured: true,
      },
      {
        id: 3,
        authorName: "Unpublished Client",
        quote: "This story should stay private.",
        featured: false,
      },
    ]);
    renderSection();

    expect(await screen.findByText(/The first published story/)).toBeInTheDocument();
    expect(screen.queryByText(/This story should stay private/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" }));

    expect(await screen.findByText(/The next published story/)).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("shows a truthful empty state when there are no published testimonials", async () => {
    fetchPublicTestimonials.mockResolvedValue([]);

    renderSection();

    await waitFor(() => {
      expect(screen.getByText(/Client stories will appear here once they are published/))
        .toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /View our portfolio/ })).toBeInTheDocument();
  });
});
