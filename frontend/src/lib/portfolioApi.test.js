import { describe, expect, it } from "vitest";
import { getProjectCategories, normalizeProject, safeLinkUrl } from "./portfolioApi";

describe("safeLinkUrl", () => {
  it("keeps valid http(s) URLs and site-relative paths", () => {
    expect(safeLinkUrl("https://bnctechservices.com/")).toBe("https://bnctechservices.com/");
    expect(safeLinkUrl("http://example.com/path?x=1")).toBe("http://example.com/path?x=1");
    expect(safeLinkUrl("  https://www.pantopoleio.nl/ ")).toBe("https://www.pantopoleio.nl/");
    expect(safeLinkUrl("/portfolio")).toBe("/portfolio");
  });

  it("rejects unsafe or malformed links", () => {
    [
      "javascript:alert(1)",
      "JaVaScRiPt:alert(1)",
      " javascript:alert(1)",
      "java\tscript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:msgbox(1)",
      "file:///C:/secret.txt",
      "ftp://example.com/file",
      "//evil.example.com",
      "/\\evil.example.com",
      "https://example.com/a b",
      "example.com",
      "",
      null,
      undefined,
    ].forEach((value) => expect(safeLinkUrl(value)).toBeNull());
  });
});

describe("normalizeProject links", () => {
  it("only exposes a safe project URL", () => {
    expect(normalizeProject({ title: "A", projectUrl: "https://example.com/" }, 0).url).toBe(
      "https://example.com/",
    );
    expect(normalizeProject({ title: "B", projectUrl: "javascript:alert(1)" }, 1).url).toBeNull();
    expect(normalizeProject({ title: "C" }, 2).url).toBeNull();
  });
});

describe("project categories", () => {
  it("come only from the categories saved in the project's tags, in saved order", () => {
    const project = normalizeProject(
      { title: "Shop", tags: ["React", "E-Commerce", "Web Development", "Node.js"] },
      0,
    );
    expect(project.categories).toEqual(["E-Commerce", "Web Development"]);
    expect(project.category).toBe("E-Commerce");
    expect(project.technologies).toEqual(["React", "Node.js"]);
  });

  it("supports the extra categories and aliases", () => {
    expect(getProjectCategories({ tags: ["crm", "Cloud", "UI/UX Design", "Mobile App", "Custom Software"] })).toEqual([
      "CRM",
      "Cloud Solutions",
      "UI/UX Design",
      "Mobile Apps",
      "Custom Software",
    ]);
  });

  it("does not guess a category from the title or description", () => {
    const project = normalizeProject(
      { title: "Company Website", summary: "A modern e-commerce web development project", tags: [] },
      0,
    );
    expect(project.categories).toEqual([]);
    expect(project.category).toBe("");
  });

  it("uses managed category assignments from the portfolio API", () => {
    const project = normalizeProject(
      {
        title: "Managed project",
        tags: ["React"],
        categories: [{ id: 12, name: "Cloud Modernization" }],
        categoryIds: [12],
      },
      0,
    );
    expect(project.categories).toEqual(["Cloud Modernization"]);
    expect(project.category).toBe("Cloud Modernization");
    expect(project.technologies).toEqual(["React"]);
  });
});

describe("client logo", () => {
  it("uses the uploaded client logo and never the cover image", () => {
    const project = normalizeProject(
      { title: "A", coverImage: "/api/uploads/cover.png", clientLogo: "/api/uploads/logo.png" },
      0,
    );
    expect(project.logo).toBe("/api/uploads/logo.png");
    expect(project.coverImage).toBe("/api/uploads/cover.png");
  });

  it("has no logo (so the WM badge shows) when none is saved or the value is unusable", () => {
    expect(normalizeProject({ title: "A", coverImage: "/api/uploads/cover.png" }, 0).logo).toBe("");
    expect(normalizeProject({ title: "A", clientLogo: "C:/Users/x/logo.png" }, 0).logo).toBe("");
    expect(normalizeProject({ title: "A", clientLogo: "javascript:alert(1)" }, 0).logo).toBe("");
  });
});
