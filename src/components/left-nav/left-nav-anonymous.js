"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import feedsImg from '@/assets/feeds.png';
import myfeedImg from '@/assets/my_feed.png';
import newsImg from '@/assets/news.png';
import surveyImg from '@/assets/survey.png';
import faqImg from '@/assets/FAQ.png';
import menuImg from '@/assets/menu.png';
import closeImg from '@/assets/close_light.png';

import classes from './left-nav.module.css';

export default function NavAnonymous() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    const menuImage = isOpen ? closeImg : menuImg;
    const pathname = usePathname();

    const navItems = [
      { href: '/anonymous/feeds', label: 'FEEDS', icon: feedsImg },
      { href: '/anonymous/my_feeds', label: 'My FEEDS', icon: myfeedImg },
      { href: '/anonymous/news', label: 'NEWS', icon: newsImg },
      { href: '/anonymous/survey', label: 'SURVEY', icon: surveyImg },
      { href: '/anonymous/faq', label: 'FAQ', icon: faqImg },
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



