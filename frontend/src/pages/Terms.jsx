import { Link } from "react-router-dom";
import LegalPage from "../components/common/LegalPage";
import { paths } from "../routes/paths";

/*
 * DRAFT FOR REVIEW. These are conventional website terms written without any
 * refund, payment, warranty or governing-law commitments, because none were
 * supplied. They must be reviewed by a legal adviser before launch.
 *
 * Items the business must confirm / have reviewed (deliberately NOT stated):
 *   - governing law and the courts that have jurisdiction
 *   - any refund, cancellation, payment or service-level terms
 *   - ownership of client names, logos and project descriptions, and
 *     permission to show them
 *   - limitation of liability wording
 */

export default function Terms() {
  const sections = [
    {
      id: "using-this-website",
      heading: "Using this website",
      body: (
        <p>
          By using this website you agree to these terms. If you do not agree with them, please do
          not use the website.
        </p>
      ),
    },
    {
      id: "information-on-this-website",
      heading: "Information on this website",
      body: (
        <p>
          The website gives general information about W Morgan Technologies, its services, products
          and projects. We try to keep it accurate and up to date, but it may change without notice
          and nothing on it is a quotation, a binding offer or professional advice.
        </p>
      ),
    },
    {
      id: "enquiries-and-applications",
      heading: "Enquiries and job applications",
      body: (
        <p>
          Sending an enquiry or a job application through the website does not create a contract,
          an offer of work or an offer of employment. How we use the information you send is
          explained in our <Link to={paths.privacy}>Privacy Policy</Link>.
        </p>
      ),
    },
    {
      id: "acceptable-use",
      heading: "Acceptable use",
      body: (
        <>
          <p>When using the website you agree not to:</p>
          <ul>
            <li>attempt to gain unauthorised access to the website, its administration area or its data;</li>
            <li>interfere with or disrupt the website or the servers that run it;</li>
            <li>send information that is unlawful, misleading or that belongs to someone else without permission.</li>
          </ul>
        </>
      ),
    },
    {
      id: "content-and-ownership",
      heading: "Content and ownership",
      body: (
        <p>
          Unless stated otherwise, the content and design of this website belong to W Morgan
          Technologies or are used with permission. Names, logos and descriptions of clients and
          projects belong to their respective owners.
        </p>
      ),
    },
    {
      id: "third-party-links",
      heading: "Third-party links",
      body: (
        <p>
          The website links to other websites, including client websites and social media. We do
          not control those websites and are not responsible for their content or practices.
        </p>
      ),
    },
    {
      id: "availability-and-liability",
      heading: "Availability and liability",
      body: (
        <p>
          The website is provided on an &ldquo;as available&rdquo; basis and we do not promise that
          it will always be available or free of errors. To the extent the law allows, W Morgan
          Technologies is not liable for loss arising from your use of the website.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: (
        <p>
          We may update these terms from time to time. The &ldquo;last updated&rdquo; date at the
          top of this page shows when they last changed.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Terms & Conditions"
      metaDescription="The terms for using the W Morgan Technologies website, including enquiries, job applications and third-party links."
      intro="These terms apply to your use of this website."
      lastUpdated="9 October 2026"
      sections={sections}
      otherPage={{ label: "Privacy Policy", path: paths.privacy }}
    />
  );
}
