import AdminLayout from "../components/AdminLayout";
import ContentManager from "../components/ContentManager";
import { siteContentResources } from "../data/siteContent";

const fields = [
  {
    name: "name",
    label: "Product name",
    required: true,
  },
  {
    name: "category",
    label: "Category",
    required: true,
  },
  {
    name: "description",
    label: "Short description",
    type: "textarea",
    required: true,
  },
  {
    name: "features",
    label: "Key features",
    type: "tags",
  },
  {
    name: "imageUrl",
    label: "Product image",
    type: "image",
  },
  {
    name: "isActive",
    label: "Visibility",
    type: "checkbox",
    checkboxLabel: "Show on public website",
  },
];

export default function Products() {
  return (
    <AdminLayout>
      <ContentManager
        title="Product Suite"
        description="Add and manage the products shown on your website."
        resource={siteContentResources.products}
        fields={fields}
        columns={[
          { key: "name", label: "Product" },
          { key: "category", label: "Category" },
          { key: "imageUrl", label: "Image", type: "image" },
          { key: "isActive", label: "Status" },
        ]}
        emptyMessage="No products added yet. Add your first product to get started."
      />
    </AdminLayout>
  );
}
