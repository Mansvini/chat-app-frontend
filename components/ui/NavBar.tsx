// components/ui/Navbar.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { ModeToggle } from '../darkMode';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
        <div className={styles.logo}>
            <Link href="/">ChatExpress</Link>
        </div>
        <ul className={styles.navLinks}>
        {isAuthenticated ? (
          <>
            <li>
              <button onClick={logout} className={styles.navButton}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className={pathname === '/login' ? styles.active : ''}>
              <Link href="/login">Login</Link>
            </li>
            <li className={pathname === '/signup' ? styles.active : ''}>
              <Link href="/signup">Sign Up</Link>
            </li>
          </>
        )}
          <li className={styles.modeToggle}>
              <ModeToggle/>
          </li>
        </ul>
    </nav>
  );
};

export default Navbar;