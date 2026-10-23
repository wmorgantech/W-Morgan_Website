import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPublicPortfolio } from "../../lib/api";
import TrustedClients from "./TrustedClients";

vi.mock("../../lib/api", () => ({
  fetchPublicPortfolio: vi.fn(),
}));

describe("TrustedClients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows published client logos at the larger contain size with labels", async () => {
    fetchPublicPortfolio.mockResolvedValue([
      {
        id: 1,
        clientName: "Color Client",
        clientLogo: "https://example.com/color-client.png",
      },
    ]);

    render(<TrustedClients />);

    const logo = await screen.findByRole("img", { name: "Color Client logo" });
    expect(logo).toHaveClass("h-full", "w-full", "object-contain");
    expect(logo.className).not.toMatch(/grayscale|contrast-0|brightness-0/);
    expect(screen.getAllByText("Color Client")[0]).toHaveClass("text-xs");
    expect(screen.getByText("Our Clients")).toBeInTheDocument();
  });
});
