import ContentManager from "../components/ContentManager";
import AdminLayout from "../components/AdminLayout";
import { siteContentResources } from "../data/siteContent";

// Saved in the project's tags. Keep in step with PORTFOLIO_FILTERS in frontend/src/lib/portfolioApi.js.
const categoryChoices = [
  "Web Development",
  "E-Commerce",
  "CRM",
  "Mobile Apps",
  "UI/UX Design",
  "Custom Software",
  "Cloud Solutions",
];

const fields = [
  {
    name: "title",
    label: "Project title",
    required: true,
  },
  {
    name: "summary",
    label: "Short description",
    type: "textarea",
    required: true,
  },
  {
    name: "coverImage",
    label: "Project image",
    type: "image",
  },
  {
    name: "clientLogo",
    label: "Client logo",
    type: "image",
    hint: "Shown beside the project name and in the Trusted Clients strip. Separate from the project image above.",
  },
  {
    name: "clientName",
    label: "Client",
  },
  {
    name: "projectUrl",
    label: "Project URL",
    type: "url",
  },
  {
    name: "tags",
    label: "Category and technologies",
    type: "tags",
    suggestions: categoryChoices,
    hint: "Select the category (or categories) above; the first one selected is shown on the project card and used by the website's filters. Add technologies such as React or Node.js as plain text, separated by commas.",
  },
  {
    name: "featured",
    label: "Publishing",
    type: "checkbox",
    checkboxLabel: "Publish on the public website",
    hint: "Unpublished projects stay in Admin and never appear on the website.",
  },
];

const detailFields = [
  {
    key: "summary",
    label: "Description",
    type: "long",
  },
  {
    key: "clientName",
    label: "Client",
  },
  {
    key: "projectUrl",
    label: "Project URL",
    type: "link",
  },
  {
    key: "tags",
    label: "Technologies",
    type: "tags",
  },
  {
    key: "updatedAt",
    label: "Last updated",
    type: "date",
  },
];

const statusLabels = { featured: ["Published", "Unpublished"] };

export default function Portfolio() {
  return (
    <AdminLayout>
      <ContentManager
        title="Portfolio"
        itemName="Project"
        description="Add and manage the projects shown on your portfolio."
        resource={siteContentResources.portfolio}
        fields={fields}
        columns={[
          { key: "title", label: "Project" },
          { key: "coverImage", label: "Image", type: "image" },
          { key: "summary", label: "Description" },
          { key: "clientName", label: "Client" },
          { key: "tags", label: "Technologies" },
          { key: "featured", label: "Status" },
        ]}
        detailFields={detailFields}
        statusLabels={statusLabels}
        emptyMessage="No portfolio projects added yet. Add your first project to get started."
      />
    </AdminLayout>
  );
}