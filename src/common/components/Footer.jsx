import { NavLink } from 'react-router';
import atiefLogo from '../../assets/logo-atief.png';
import ThemeSwitch from './ThemeSwitch';
import classNames from 'classnames';

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-3">
      <aside className="grid-flow-col items-center">
        <a href="http://www.atief.fr" target="_blank" rel="noreferrer">
          <img
            src={atiefLogo}
            width="84.6"
            height="30"
            className={classNames('bg-neutral-50', 'fill-current')}
            alt="Logo ATIEF"
          />
        </a>
        <p>
          Copyright ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          - Tous droits réservés
        </p>
      </aside>
      <nav className="grid-flow-col gap-x-4 md:gap-y-4 md:place-self-center md:justify-self-center">
        <ThemeSwitch />
      </nav>
      <nav className="grid-flow-col gap-x-4 md:gap-y-4 md:place-self-center md:justify-self-end">
        <NavLink to="privacy" className={({ isActive }) => isActive ? 'link link-primary' : 'link'}>Données personnelles</NavLink>
        <NavLink to="legal-notices" className={({ isActive }) => isActive ? 'link link-primary' : 'link'}>Mentions légales</NavLink>
      </nav>
    </footer>
  );
}
