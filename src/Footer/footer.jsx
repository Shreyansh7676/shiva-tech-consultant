import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const footerLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/services' },
  { label: 'Disclaimer', to: '/disclaimer' },
  { label: 'Contact Us', to: '/contact' },
];

export function FooterThree() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <nav aria-label="Footer navigation">
          <ul className="site-footer__links">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="site-footer__credit">
          Developed by{' '}
          <a href="https://www.linkedin.com/in/shreyansh-srivastava-945034257/" target="_blank" rel="noreferrer">
            Shreyansh Srivastava
          </a>
        </p>
      </div>
    </footer>
  );
}

export default FooterThree;
