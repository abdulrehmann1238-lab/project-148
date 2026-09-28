import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { ToothArcMark, FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from '../ui/Icons';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <footer className="bg-ink-bg text-bg/90 selection:bg-brass-t selection:text-ink-bg">
      {/* Top Band (Closing Moment per PRD §20) */}
      <div className="border-b border-white/10 py-16 sm:py-20">
        <div className="max-w-content mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brass mb-2 block">
              EDITORIAL NOMINATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-bg font-normal tracking-tight leading-tight">
              Know a dentist our readers should meet?
            </h2>
            <p className="text-bg/70 text-sm sm:text-base mt-2">
              Nominate a practitioner for the Distinguished Directory. Our editorial team reviews every clinical nomination.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="mailto:nominations@dentalnewsnetwork.example?subject=Distinguished%20Dentist%20Nomination"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-brass text-brass-t hover:bg-brass hover:text-ink-bg font-sans font-semibold text-sm transition-colors duration-180"
            >
              <Mail className="w-4 h-4" />
              <span>Send a nomination</span>
            </a>
            <span className="text-xs text-bg/50">
              or email nominations@dentalnewsnetwork.example
            </span>
          </div>
        </div>
      </div>

      {/* Middle Columns & Newsletter */}
      <div className="py-14 sm:py-16 border-b border-white/10">
        <div className="max-w-content mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: News */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-brass font-semibold">
              Publication
            </h3>
            <ul className="space-y-2 text-sm text-bg/75">
              <li>
                <Link to="/" className="hover:text-bg transition-colors">
                  Latest News
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-bg transition-colors">
                  Clinical Studies
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-bg transition-colors">
                  Practice Management
                </Link>
              </li>
              <li>
                <a href="#tips-section" className="hover:text-bg transition-colors">
                  Dental Tips
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Directory */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-brass font-semibold">
              Directory
            </h3>
            <ul className="space-y-2 text-sm text-bg/75">
              <li>
                <Link to="/find-a-dentist" className="hover:text-bg transition-colors">
                  Find a Dentist
                </Link>
              </li>
              <li>
                <Link to="/find-a-dentist?mode=distinguished" className="hover:text-bg transition-colors flex items-center gap-1.5 text-brass">
                  <span>Distinguished Dentists</span>
                  <span className="text-xs">★</span>
                </Link>
              </li>
              <li>
                <Link to="/wp-admin" className="hover:text-bg transition-colors">
                  WP-Admin Management
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-bg transition-colors">
                  Technical Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-brass font-semibold">
              Organization
            </h3>
            <ul className="space-y-2 text-sm text-bg/75">
              <li>
                <Link to="/how-it-works" className="hover:text-bg transition-colors">
                  About DNN
                </Link>
              </li>
              <li>
                <a href="mailto:contact@dentalnewsnetwork.example" className="hover:text-bg transition-colors">
                  Editorial Contact
                </a>
              </li>
              <li>
                <a href="mailto:advertise@dentalnewsnetwork.example" className="hover:text-bg transition-colors">
                  Advertising & Media Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-brass font-semibold">
              The Morning Briefing
            </h3>
            <p className="text-xs text-bg/70 leading-relaxed">
              Daily dental trade news, peer-reviewed clinical summaries, and distinguished profiles delivered before clinic hours.
            </p>

            {newsletterSubmitted ? (
              <div className="p-3 rounded-sm bg-success/20 border border-success/40 text-success-t text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <span>Thanks. Check your inbox to confirm your subscription.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 mt-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full h-10 px-3 text-xs bg-white/10 border border-white/20 rounded-sm text-bg placeholder:text-bg/40 focus:outline-none focus:border-brass"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-sm bg-brass text-ink-bg font-sans font-semibold text-xs hover:bg-brass-t transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Brass Hairline above Bottom Bar per PRD §20 */}
      <div className="h-[1px] bg-brass/30 max-w-content mx-auto" />

      {/* Bottom Bar */}
      <div className="max-w-content mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-bg/60">
        <div className="flex items-center gap-3">
          <ToothArcMark className="w-4 h-4 text-brass" />
          <span>© {new Date().getFullYear()} Dental News Network. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-5">
          <span className="hover:text-bg cursor-pointer">Privacy Policy</span>
          <span className="hover:text-bg cursor-pointer">Terms of Service</span>
          <span className="hover:text-bg cursor-pointer">Cookies Policy</span>
        </div>

        {/* Social Icons (in --sage per PRD §20) */}
        <div className="flex items-center gap-3 text-sage">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-bg" aria-label="Facebook">
            <FacebookIcon className="w-3.5 h-3.5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-bg" aria-label="Instagram">
            <InstagramIcon className="w-3.5 h-3.5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-bg" aria-label="LinkedIn">
            <LinkedInIcon className="w-3.5 h-3.5" />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-bg" aria-label="X">
            <XIcon className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
