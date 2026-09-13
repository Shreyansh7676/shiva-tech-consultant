import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Untitled-2.png';
import './navbar.css';

const defaultItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Portfolio',
    children: [
      {
        label: 'Technical Advisory',
        children: [
          { label: 'Energy Management', to: '/energymanagement' },
          { label: 'Environment Management', to: '/energymanagement' },
          { label: 'Project Management', to: '/projectmanagement' },
          { label: 'Asset Management', to: '/assetmanagement' },
          { label: 'Value Engineering', to: '/value' },
          { label: 'ESG Management', to: '/projectmanagement' },
        ],
      },
      {
        label: 'Services',
        children: [
          { label: 'Energy Audit', to: '/energyaudit' },
          { label: 'Safety Audit', to: '/techadv' },
          { label: 'Management System Audit', to: '/techadv' },
          { label: 'GHG Validation', to: '/techadv' },
          { label: 'LCA', to: '/techadv' },
          { label: 'Valuation', to: '/valuation' },
        ],
      },
      { label: 'Manufacturing', to: '/manufacturing' },
      { label: 'Sales', href: '#action/3.3' },
    ],
  },
  { label: 'Contact', to: '/contact' },
  { label: 'Gallery', to: '/gallery' },
];

function MenuLink({ item, onNavigate }) {
  if (item.to) {
    return (
      <NavLink
        className={({ isActive }) => `site-navbar__menu-link${isActive ? ' is-active' : ''}`}
        end={item.to === '/'}
        to={item.to}
        onClick={onNavigate}
      >
        {item.label}
      </NavLink>
    );
  }

  return (
    <a className="site-navbar__menu-link" href={item.href} onClick={onNavigate}>
      {item.label}
    </a>
  );
}

/**
 * A reusable navigation bar. Pass `items`, `logo`, `brandTo`, or `brandLabel`
 * to adapt it for another page while retaining its dropdown behaviour.
 */
function Navbar({
  items = defaultItems,
  logo = Logo,
  brandTo = '/',
  brandLabel = 'Home',
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navbarRef = useRef(null);
  const location = useLocation();

  const closeMenus = () => {
    setIsMobileOpen(false);
    setOpenMenu(null);
    setOpenSubmenu(null);
  };

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenMenu(null);
    setOpenSubmenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenMenu(null);
        setOpenSubmenu(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false);
        setOpenMenu(null);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleMenu = (menuId) => {
    setOpenMenu((current) => (current === menuId ? null : menuId));
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (submenuId) => {
    setOpenSubmenu((current) => (current === submenuId ? null : submenuId));
  };

  return (
    <header className="site-navbar" ref={navbarRef}>
      <div className="site-navbar__container">
        <Link className="site-navbar__brand" to={brandTo} aria-label={brandLabel} onClick={closeMenus}>
          <img src={logo} alt="Site logo" />
        </Link>

        <button
          className="site-navbar__toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-controls="site-navigation"
          aria-expanded={isMobileOpen}
          onClick={() => {
            setIsMobileOpen((isOpen) => !isOpen);
            setOpenMenu(null);
            setOpenSubmenu(null);
          }}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="site-navigation"
          className={`site-navbar__navigation${isMobileOpen ? ' is-open' : ''}`}
          aria-label="Main navigation"
        >
          <ul className="site-navbar__list">
            {items.map((item, index) => {
              const menuId = `menu-${index}`;
              const isOpen = openMenu === menuId;

              if (!item.children) {
                return (
                  <li className="site-navbar__item" key={item.label}>
                    <MenuLink item={item} onNavigate={closeMenus} />
                  </li>
                );
              }

              return (
                <li className={`site-navbar__item site-navbar__item--dropdown${isOpen ? ' is-open' : ''}`} key={item.label}>
                  <button
                    className="site-navbar__trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${menuId}-panel`}
                    onClick={() => toggleMenu(menuId)}
                  >
                    {item.label}<span className="site-navbar__caret" aria-hidden="true" />
                  </button>
                  <ul className="site-navbar__dropdown" id={`${menuId}-panel`}>
                    {item.children.map((child, childIndex) => {
                      const submenuId = `${menuId}-submenu-${childIndex}`;
                      const isSubmenuOpen = openSubmenu === submenuId;

                      if (!child.children) {
                        return (
                          <li className="site-navbar__dropdown-item" key={child.label}>
                            <MenuLink item={child} onNavigate={closeMenus} />
                          </li>
                        );
                      }

                      return (
                        <li className={`site-navbar__dropdown-item site-navbar__dropdown-item--submenu${isSubmenuOpen ? ' is-open' : ''}`} key={child.label}>
                          <button
                            className="site-navbar__submenu-trigger"
                            type="button"
                            aria-expanded={isSubmenuOpen}
                            aria-controls={`${submenuId}-panel`}
                            onClick={() => toggleSubmenu(submenuId)}
                          >
                            {child.label}<span className="site-navbar__submenu-caret" aria-hidden="true" />
                          </button>
                          <ul className="site-navbar__submenu" id={`${submenuId}-panel`}>
                            {child.children.map((nestedItem) => (
                              <li className="site-navbar__dropdown-item" key={nestedItem.label}>
                                <MenuLink item={nestedItem} onNavigate={closeMenus} />
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
