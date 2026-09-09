import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-clinical-navy text-slate-300 text-sm py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>&copy; 2026 Hospital Patient Management System. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/legal?section=privacy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/legal?section=terms" className="hover:text-white">Terms of Use</Link>
          <Link to="/legal?section=hipaa" className="hover:text-white">HIPAA Notice</Link>
        </div>
      </div>
    </footer>
  )
}
