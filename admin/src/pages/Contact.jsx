import ContentManager from "../components/ContentManager";
import AdminLayout from "../components/AdminLayout";
import { siteContentResources } from "../data/siteContent";

const fields = [
  { name: "status", label: "Inquiry status", type: "select", options: [{ value: "NEW", label: "New" }, { value: "IN_PROGRESS", label: "In progress" }, { value: "RESPONDED", label: "Responded" }, { value: "CLOSED", label: "Closed" }], required: true },
];

const detailFields = [
  { key: "message", label: "Message", type: "long" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone" },
  { key: "company", label: "Company" },
  { key: "service", label: "Service" },
  { key: "createdAt", label: "Received", type: "date" },
];

export default function Contact() {
  return (
    <AdminLayout>
      <ContentManager
        title="Contact Inquiries"
        itemName="Inquiry"
        description="Review messages submitted through the public contact form."
        resource={siteContentResources.inquiries}
        fields={fields}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "company", label: "Company" },
          { key: "service", label: "Service" },
          { key: "message", label: "Message" },
          { key: "createdAt", label: "Received", type: "date" },
          { key: "status", label: "Status" },
        ]}
        detailFields={detailFields}
        emptyMessage="No contact inquiries have been received."
        allowCreate={false}
        allowEdit
        allowDelete={false}
      />
    </AdminLayout>
  );
}