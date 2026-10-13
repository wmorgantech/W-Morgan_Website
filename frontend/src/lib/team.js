// Normalises team records from the API. Admin stores the structured sections as plain
// lines of text, so the parsing lives here once and both Team pages share it.

export const TEAM_GROUPS = [
  { type: "LEADERSHIP", label: "Leadership" },
  { type: "EMPLOYEE", label: "Team" },
  { type: "INTERN", label: "Interns" },
];

const list = (value) =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];

// "Category: a, b, c" -> { category, items }. Lines without a category are collected
// under "Other skills" so nothing an admin typed is lost.
export function groupSkills(lines) {
  const groups = [];
  const other = [];

  list(lines).forEach((line) => {
    const split = line.indexOf(":");
    if (split > 0) {
      const items = line
        .slice(split + 1)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      if (items.length) {
        groups.push({ category: line.slice(0, split).trim(), items });
        return;
      }
    }
    other.push(line.replace(/:\s*$/, ""));
  });

  if (other.length) groups.push({ category: groups.length ? "Other skills" : "Skills", items: other });
  return groups;
}

// "Project name: description" -> { title, description }
export function parseProjects(lines) {
  return list(lines).map((line) => {
    const split = line.indexOf(":");
    return split > 0
      ? { title: line.slice(0, split).trim(), description: line.slice(split + 1).trim() }
      : { title: line, description: "" };
  });
}

export function initials(name) {
  return (
    String(name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "WM"
  );
}

export function normalizeMember(record) {
  return {
    id: record.id,
    name: record.name || "",
    designation: record.designation || "",
    memberType: record.memberType || "EMPLOYEE",
    department: record.department || "",
    location: record.location || "",
    photoUrl: typeof record.photoUrl === "string" ? record.photoUrl : "",
    summary: record.professionalSummary || "",
    experience: record.experience || "",
    responsibilities: list(record.responsibilities),
    skillGroups: groupSkills(record.skills),
    education: list(record.education),
    strengths: list(record.strengths),
    projects: parseProjects(record.projects),
  };
}
