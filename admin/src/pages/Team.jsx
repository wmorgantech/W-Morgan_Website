import ContentManager from "../components/ContentManager";
import AdminLayout from "../components/AdminLayout";
import { siteContentResources } from "../data/siteContent";

const fields = [
  { name: "name", label: "Full name", required: true },
  { name: "designation", label: "Designation", required: true },
  {
    name: "memberType",
    label: "Group",
    type: "select",
    required: true,
    options: [
      { value: "LEADERSHIP", label: "Leadership" },
      { value: "EMPLOYEE", label: "Employee" },
      { value: "INTERN", label: "Intern" },
    ],
    hint: "Controls which heading the profile appears under on the Our Team page.",
  },
  { name: "department", label: "Department" },
  { name: "location", label: "Location" },
  {
    name: "photoUrl",
    label: "Photo",
    type: "image",
  },
  {
    name: "professionalSummary",
    label: "Professional summary",
    type: "textarea",
    hint: "Only add details the team member has confirmed.",
  },
  {
    name: "experience",
    label: "Experience",
    hint: "For example a duration or a short statement. Leave blank if not confirmed.",
  },
  {
    name: "responsibilities",
    label: "Responsibilities",
    type: "lines",
    hint: "One responsibility per line.",
  },
  {
    name: "skills",
    label: "Technical skills",
    type: "lines",
    hint: "One category per line, written as Category: skill, skill. For example “Frontend: React, CSS”.",
  },
  {
    name: "education",
    label: "Education",
    type: "lines",
    hint: "One entry per line, for example degree, institution and year.",
  },
  {
    name: "strengths",
    label: "Key strengths",
    type: "lines",
    hint: "One strength per line.",
  },
  {
    name: "projects",
    label: "Projects",
    type: "lines",
    hint: "One project per line, written as Project name: short description.",
  },
  { name: "sortOrder", label: "Display order", type: "number", hint: "Lower numbers appear first within a group." },
  {
    name: "published",
    label: "Publishing",
    type: "checkbox",
    checkboxLabel: "Publish on the public website",
    hint: "Unpublished profiles stay in Admin and never appear on the website.",
  },
];

const detailFields = [
  { key: "designation", label: "Designation" },
  { key: "memberType", label: "Group", format: (value) => String(value).charAt(0) + String(value).slice(1).toLowerCase() },
  { key: "department", label: "Department" },
  { key: "location", label: "Location" },
  { key: "professionalSummary", label: "Professional summary", type: "long" },
  { key: "experience", label: "Experience" },
  { key: "responsibilities", label: "Responsibilities", format: (value) => value.join("; ") },
  { key: "skills", label: "Technical skills", format: (value) => value.join("; ") },
  { key: "education", label: "Education", format: (value) => value.join("; ") },
  { key: "strengths", label: "Key strengths", format: (value) => value.join("; ") },
  { key: "projects", label: "Projects", format: (value) => value.join("; ") },
  { key: "updatedAt", label: "Last updated", type: "date" },
];

const statusLabels = { published: ["Published", "Unpublished"] };

export default function Team() {
  return (
    <AdminLayout>
      <ContentManager
        title="Team Members"
        itemName="Team member"
        description="Create and manage team profiles. Only published profiles appear on the Our Team page."
        resource={siteContentResources.team}
        fields={fields}
        detailFields={detailFields}
        statusLabels={statusLabels}
        columns={[
          { key: "photoUrl", label: "Photo", type: "image" },
          { key: "name", label: "Name" },
          { key: "designation", label: "Designation" },
          { key: "memberType", label: "Group" },
          { key: "published", label: "Status" },
        ]}
        emptyMessage="No team members added yet. Add a profile to get started."
      />
    </AdminLayout>
  );
}
