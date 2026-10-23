import { useCallback, useEffect, useState } from "react";
import ContentManager from "../components/ContentManager";
import AdminLayout from "../components/AdminLayout";
import api, { getApiError } from "../lib/api";
import { siteContentResources } from "../data/siteContent";

const categoryFields = [
  { name: "name", label: "Category name", required: true },
  { name: "sortOrder", label: "Display order", type: "number" },
  {
    name: "isActive",
    label: "Publishing",
    type: "checkbox",
    checkboxLabel: "Show as a public portfolio filter",
  },
];

const projectFields = (categories) => [
  { name: "title", label: "Project title", required: true },
  { name: "clientName", label: "Client" },
  {
    name: "summary",
    label: "Short description",
    type: "textarea",
    required: true,
  },
  { name: "coverImage", label: "Project image", type: "image" },
  {
    name: "clientLogo",
    label: "Client logo",
    type: "image",
    hint: "Shown beside the project name and in the Trusted Clients strip. Separate from the project image above.",
  },
  { name: "projectUrl", label: "Project URL", type: "url" },
  {
    name: "tags",
    label: "Technologies",
    type: "tags",
    hint: "Add technologies such as React or Node.js, separated by commas.",
  },
  {
    name: "categoryIds",
    label: "Categories",
    type: "multiSelect",
    options: categories.map(({ id, name }) => ({ value: id, label: name })),
    hint: "Select one or more categories. They are used for the filters on the public Portfolio page.",
  },
  { name: "sortOrder", label: "Display order", type: "number" },
  {
    name: "featured",
    label: "Publishing",
    type: "checkbox",
    checkboxLabel: "Publish on the public website",
    hint: "Unpublished projects stay in Admin and never appear on the website.",
  },
];

const detailFields = [
  { key: "summary", label: "Description", type: "long" },
  { key: "clientName", label: "Client" },
  { key: "projectUrl", label: "Project URL", type: "link" },
  {
    key: "categories",
    label: "Categories",
    format: (value) => value.map((category) => category.name).join(", ") || "—",
  },
  { key: "tags", label: "Technologies", type: "tags" },
  { key: "sortOrder", label: "Display order" },
  { key: "updatedAt", label: "Last updated", type: "date" },
];

const categoryDetailFields = [
  { key: "sortOrder", label: "Display order" },
  { key: "isActive", label: "Public filter" },
  { key: "updatedAt", label: "Last updated", type: "date" },
];

const statusLabels = { featured: ["Published", "Unpublished"] };
const categoryStatusLabels = { isActive: ["Active", "Inactive"] };

async function fetchManagedCategories() {
  const { data } = await api.get(siteContentResources.portfolioCategories);
  if (!Array.isArray(data)) {
    throw new Error("Portfolio categories response was not a list.");
  }
  return data;
}

export default function Portfolio() {
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await fetchManagedCategories());
      setCategoryError("");
    } catch (error) {
      setCategoryError(getApiError(error));
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchManagedCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((error) => {
        if (active) setCategoryError(getApiError(error));
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminLayout>
      <ContentManager
        title="Portfolio Categories"
        itemName="Category"
        description="Add, edit, order, and publish the categories used to filter portfolio projects."
        resource={siteContentResources.portfolioCategories}
        fields={categoryFields}
        columns={[
          { key: "name", label: "Category" },
          { key: "sortOrder", label: "Display order" },
          { key: "isActive", label: "Status" },
        ]}
        detailFields={categoryDetailFields}
        statusLabels={categoryStatusLabels}
        emptyMessage="No portfolio categories added yet."
        onRecordsChange={loadCategories}
      />
      {categoryError && <p className="content-error" role="alert">{categoryError}</p>}
      <div className="content-page">
        <ContentManager
          title="Portfolio"
          itemName="Project"
          description="Add and manage the projects shown on your portfolio."
          resource={siteContentResources.portfolio}
          fields={projectFields(categories)}
          columns={[
            { key: "title", label: "Project" },
            { key: "coverImage", label: "Image", type: "image" },
            { key: "clientName", label: "Client" },
            {
              key: "categories",
              label: "Categories",
              format: (value) => value.map((category) => category.name).join(", ") || "—",
            },
            { key: "sortOrder", label: "Display order" },
            { key: "featured", label: "Status" },
          ]}
          detailFields={detailFields}
          statusLabels={statusLabels}
          emptyMessage="No portfolio projects added yet. Add your first project to get started."
        />
      </div>
    </AdminLayout>
  );
}
