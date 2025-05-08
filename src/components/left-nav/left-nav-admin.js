"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import feedsImg from '@/assets/feeds.png';
import newsImg from '@/assets/news.png';
import surveyImg from '@/assets/survey.png';
import faqImg from '@/assets/FAQ.png';
import settingsImg from '@/assets/settings.png';
import menuImg from '@/assets/menu.png';
import closeImg from '@/assets/close_light.png'

import classes from './left-nav.module.css'

export default function NavAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  const menuImage = isOpen ? closeImg : menuImg;

  const navItems = [
    { href: '/admin/feeds', label: 'FEEDS', icon: feedsImg },
    { href: '/admin/news', label: 'NEWS', icon: newsImg },
    { href: '/admin/survey', label: 'SURVEY', icon: surveyImg },
    { href: '/admin/faq', label: 'FAQ', icon: faqImg },
    { href: '/admin/settings', label: 'SETTINGS', icon: settingsImg },
  ];

  return (
    <>
      <div className={classes.hamburger} onClick={toggleMenu}>
        <Image src={menuImage} alt="Menu" width={30} height={30} />
      </div>
      <aside className={`${classes.sidebar} ${isOpen ? classes.open : ''}`}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMenu}
            className={`${pathname === item.href ? classes.active : ''}`}
          >
            <Image src={item.icon} alt={item.label.toLowerCase()} width={24} height={24} />
            {item.label}
          </Link>
        ))}
      </aside>
    </>
  );
}


// "use client";

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// import feedsImg from '@/assets/feeds.png';
// import newsImg from '@/assets/news.png';
// import surveyImg from '@/assets/survey.png';
// import faqImg from '@/assets/FAQ.png';
// import settingsImg from '@/assets/settings.png';
// import menuImg from '@/assets/menu.png';
// import closeImg from '@/assets/close.png'

// import classes from './left-nav.module.css'


// export default function NavAdmin() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(prev => !prev);
//   const closeMenu = () => setIsOpen(false);

//   const menuImage = isOpen ? closeImg : menuImg;

//   return (
//     <>
//       <div className={classes.hamburger} onClick={toggleMenu}>
//         <Image src={menuImage} alt="Menu" width={30} height={30} />
//       </div>
//       <aside className={`${classes.sidebar} ${isOpen ? classes.open : ''}`}>
//         <Link href="/admin/feeds" onClick={closeMenu}>
//           <Image src={feedsImg} alt="feeds" width={24} height={24} />
//           FEEDS
//         </Link>
//         <Link href="/admin/news" onClick={closeMenu}>
//           <Image src={newsImg} alt="news" width={24} height={24} />
//           NEWS
//         </Link>
//         <Link href="/admin/survey" onClick={closeMenu}>
//           <Image src={surveyImg} alt="survey" width={24} height={24} />
//           SURVEY
//         </Link>
//         <Link href="/admin/faq" onClick={closeMenu}>
//           <Image src={faqImg} alt="faq" width={24} height={24} />
//           FAQ
//         </Link>
//         <Link href="/admin/settings" onClick={closeMenu}>
//           <Image src={settingsImg} alt="settings" width={24} height={24} />
//           SETTINGS
//         </Link>
//       </aside>
//     </>
//   );


// }