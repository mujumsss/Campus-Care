'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/assets/logo.png';
import classes from './main-header.module.css';
import { usePathname } from 'next/navigation';

export default function MainHeader() {
   const pathname =  usePathname();
   const logoLink = pathname.startsWith('/admin') ? '/admin' : pathname.startsWith('/anonymous') ? '/anonymous' : '/';

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login'; // force redirect
  }

  return (
    <header className={classes.header}>
      <Link className={classes.logo} href={logoLink}>
        <Image src={logoImg} alt="Campus Care logo" width={40} height={40} priority />
        CAMPUS CARE
      </Link>
      <nav className={classes.nav}>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}



