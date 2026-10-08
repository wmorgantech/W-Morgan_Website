import { useEffect, useState } from "react";
import api from "../lib/api";
import ContentManager from "../components/ContentManager";
import AdminLayout from "../components/AdminLayout";
import { siteContentResources } from "../data/siteContent";

const fields = [
  {
    name: "jobTitle",
    label: "Job title",
    required: true,
  },
  {
    name: "department",
    label: "Department",
  },
  {
    name: "experience",
    label: "Experience",
  },
  {
    name: "location",
    label: "Location",
  },
  {
    name: "employmentType",
    label: "Employment type",
    type: "select",
    options: [
      { value: "FULL_TIME", label: "Full time" },
      { value: "PART_TIME", label: "Part time" },
      { value: "CONTRACT", label: "Contract" },
      { value: "INTERNSHIP", label: "Internship" },
      { value: "FREELANCE", label: "Freelance" },
    ],
    required: true,
  },
  {
    name: "description",
    label: "Job description",
    type: "textarea",
    required: true,
  },
  {
    name: "skills",
    label: "Required skills",
    type: "tags",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "OPEN", label: "Open" },
      { value: "CLOSED", label: "Closed" },
      { value: "DRAFT", label: "Draft" },
    ],
  },
];

const applicationFields = [
  {
    name: "status",
    label: "Application status",
    type: "select",
    options: [
      { value: "RECEIVED", label: "Received" },
      { value: "REVIEWING", label: "Reviewing" },
      { value: "SHORTLISTED", label: "Shortlisted" },
      { value: "INTERVIEW", label: "Interview" },
      { value: "SELECTED", label: "Selected" },
      { value: "REJECTED", label: "Rejected" },
    ],
    required: true,
  },
];

function titleCase(value) {
  return String(value)
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const jobDetailFields = [
  {
    key: "description",
    label: "Description",
    type: "long",
  },
  {
    key: "skills",
    label: "Skills",
    type: "tags",
  },
  {
    key: "department",
    label: "Department",
  },
  {
    key: "experience",
    label: "Experience",
  },
  {
    key: "location",
    label: "Location",
  },
  {
    key: "employmentType",
    label: "Type",
    format: titleCase,
  },
];

export default function Careers() {
  const [openings, setOpenings] = useState({});

  useEffect(() => {
    let active = true;

    api
      .get(siteContentResources.careers)
      .then(({ data }) => {
        if (!active || !Array.isArray(data)) return;

        setOpenings(
          Object.fromEntries(
            data.map((job) => [job.id, job.jobTitle])
          )
        );
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const roleName = (id) => openings[id] || `Opening #${id}`;

  const applicationDetailFields = [
    {
      key: "coverLetter",
      label: "Cover letter",
      type: "long",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "jobOpeningId",
      label: "Applied for",
      format: roleName,
    },
    {
      key: "resumeUrl",
      label: "Resume",
      type: "link",
    },
    {
      key: "createdAt",
      label: "Received",
      type: "date",
    },
  ];

  return (
    <AdminLayout>
      <ContentManager
        title="Careers"
        itemName="Job opening"
        description="Add and manage the job openings shown on your website."
        resource={siteContentResources.careers}
        fields={fields}
        columns={[
          { key: "jobTitle", label: "Role" },
          { key: "department", label: "Department" },
          { key: "location", label: "Location" },
          {
            key: "employmentType",
            label: "Type",
            format: titleCase,
          },
          { key: "status", label: "Status" },
        ]}
        detailFields={jobDetailFields}
        emptyMessage="No job openings added yet. Add your first opening to get started."
      />

      <div className="content-page careers-applications">
        <ContentManager
          title="Applications"
          itemName="Application"
          description="Review applications submitted through the careers page."
          resource={siteContentResources.applications}
          fields={applicationFields}
          columns={[
            { key: "candidateName", label: "Candidate" },
            { key: "email", label: "Email" },
            {
              key: "jobOpeningId",
              label: "Applied for",
              format: roleName,
            },
            {
              key: "createdAt",
              label: "Received",
              type: "date",
            },
            { key: "status", label: "Status" },
          ]}
          detailFields={applicationDetailFields}
          emptyMessage="No job applications have been received."
          allowCreate={false}
          allowEdit
          allowDelete={false}
        />
      </div>
    </AdminLayout>
  );
}