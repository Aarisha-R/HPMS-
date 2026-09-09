import { Link, useSearchParams } from 'react-router-dom'

const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    paragraphs: [
      'Hospital Patient Management System collects only the information needed to provide healthcare administration services, manage accounts, and support patient care workflows.',
      'Access to patient information is limited by account permissions. We use reasonable administrative, technical, and physical safeguards to protect information from unauthorized access, disclosure, or alteration.',
      'Questions about privacy or requests regarding your information should be directed to the hospital administration team.'
    ]
  },
  terms: {
    title: 'Terms of Use',
    paragraphs: [
      'This system is provided for authorized hospital staff and patients. Users are responsible for keeping their login credentials private and for using the system only for legitimate healthcare and administrative purposes.',
      'Do not share accounts, enter false information, or attempt to access records outside your assigned permissions. Access may be suspended when misuse or unauthorized activity is detected.',
      'System availability and features may change as the hospital maintains and improves its services.'
    ]
  },
  hipaa: {
    title: 'HIPAA Notice',
    paragraphs: [
      'Protected health information in this system is handled in accordance with applicable privacy and security requirements, including the Health Insurance Portability and Accountability Act (HIPAA).',
      'Your information may be used and disclosed for treatment, payment, healthcare operations, and other purposes permitted by law. You may have rights to access, inspect, and request corrections to your protected health information.',
      'For a complete Notice of Privacy Practices or to ask a privacy question, contact the hospital privacy officer.'
    ]
  }
}

export default function Legal() {
  const [searchParams] = useSearchParams()
  const section = searchParams.get('section')
  const content = legalContent[section] || legalContent.privacy

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-clinical-teal">Hospital Patient Management System</p>
        <h1 className="text-3xl font-bold text-clinical-navy">{content.title}</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated September 4, 2026</p>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Legal information">
        {Object.entries(legalContent).map(([key, value]) => (
          <Link
            key={key}
            to={`/legal?section=${key}`}
            className={`rounded-md px-3 py-2 text-sm font-medium ${section === key || (!section && key === 'privacy') ? 'bg-clinical-teal text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {value.title}
          </Link>
        ))}
      </nav>

      <article className="space-y-5 text-slate-700 leading-7">
        {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>
    </div>
  )
}
