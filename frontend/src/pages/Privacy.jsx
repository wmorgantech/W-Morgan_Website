import { Link } from "react-router-dom";
import LegalPage from "../components/common/LegalPage";
import { usePublicSiteSettings } from "../hooks/usePublicSiteSettings";
import { paths } from "../routes/paths";

/*
 * DRAFT FOR REVIEW. Everything below describes only what this website's code
 * verifiably does today (what the two forms collect, where it is stored, who
 * can see it, and which third-party content is loaded).
 *
 * Items the business must confirm / have reviewed by a legal adviser before
 * launch (they are deliberately NOT stated on the page):
 *   - how long enquiries and applications are kept (retention period)
 *   - whether the business has a named contact for privacy requests
 *   - legal basis / obligations under applicable Indian law (e.g. the DPDP Act)
 *   - hosting provider, server logs and any backups
 *   - whether any marketing is ever sent to people who submit a form
 */

export default function Privacy() {
  const { settings } = usePublicSiteSettings();
  const email = settings.contactEmail;

  const contactLine = email ? (
    <>
      <a href={`mailto:${email}`}>{email}</a>
    </>
  ) : (
    <>
      our <Link to={paths.contact}>contact page</Link>
    </>
  );

  const sections = [
    {
      id: "who-we-are",
      heading: "Who we are",
      body: (
        <>
          <p>
            This website is operated by W Morgan Technologies
            {settings.contactLocation ? (
              <>
                , based at <span className="whitespace-pre-line">{settings.contactLocation.replace(/\n/g, " ")}</span>
              </>
            ) : null}
            . This policy explains what information the website collects through its forms and how
            that information is used.
          </p>
        </>
      ),
    },
    {
      id: "information-we-collect",
      heading: "Information we collect",
      body: (
        <>
          <p>We only collect the information you choose to send us through two forms:</p>
          <ul>
            <li>
              <strong>Contact form:</strong> your name, email address, phone number (optional),
              company or organisation (optional), the service you are interested in, and your
              message.
            </li>
            <li>
              <strong>Job application form:</strong> your name, email address, phone number
              (optional), a short cover note (optional), a link to your CV or resume (optional), and
              the role you are applying for.
            </li>
          </ul>
          <p>
            The application form does not accept file uploads. If you add a link to your CV, please
            make sure the link is shared in the way you intend.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use-it",
      heading: "How we use your information",
      body: (
        <>
          <ul>
            <li>To read and reply to your enquiry and to discuss your project.</li>
            <li>To review and respond to your job application.</li>
          </ul>
        </>
      ),
    },
    {
      id: "storage-and-access",
      heading: "Where it is stored and who can see it",
      body: (
        <>
          <p>
            Submissions are saved in the website&apos;s database. They can be viewed in a private
            administration area by authorised W Morgan Technologies staff. The website does not
            send your submissions to any other third-party service.
          </p>
        </>
      ),
    },
    {
      id: "cookies-and-tracking",
      heading: "Cookies and tracking",
      body: (
        <>
          <p>
            This website does not add advertising or analytics trackers to its pages, and it does
            not set cookies of its own for visitors.
          </p>
        </>
      ),
    },
    {
      id: "third-party-content",
      heading: "Third-party content and links",
      body: (
        <>
          <p>
            The contact page shows an embedded Google Map. When that map loads, Google may receive
            technical information such as your IP address, under Google&apos;s own terms and
            privacy policy. Links to services such as YouTube and Instagram, and to the websites of
            our clients, lead to third-party sites that have their own privacy policies.
          </p>
        </>
      ),
    },
    {
      id: "your-requests",
      heading: "Questions and requests",
      body: (
        <>
          <p>
            If you would like to know what information you have sent us, or ask us to correct or
            delete it, please contact us at {contactLine}.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: (
        <p>
          We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the
          top of this page shows when it last changed.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Privacy Policy"
      metaDescription="How W Morgan Technologies handles the information you send through the contact and job application forms on this website."
      intro="This policy describes the information collected through this website's contact and job application forms, and how it is used."
      lastUpdated="9 October 2026"
      sections={sections}
      otherPage={{ label: "Terms & Conditions", path: paths.terms }}
    />
  );
}
