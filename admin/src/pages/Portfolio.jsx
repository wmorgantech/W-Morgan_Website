import ContentManager from "../components/ContentManager";
import AdminLayout from "../components/AdminLayout";
import { siteContentResources } from "../data/siteContent";

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
    label: "Technologies / Tags",
    type: "tags",
  },
  {
    name: "featured",
    label: "Visibility",
    type: "checkbox",
    checkboxLabel: "Show on public website",
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
        emptyMessage="No portfolio projects added yet. Add your first project to get started."
      />
    </AdminLayout>
  );
}