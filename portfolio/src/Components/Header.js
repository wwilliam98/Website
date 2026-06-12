import React, { useState, useEffect } from "react";
import { SocialIcon } from 'react-social-icons';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
];

const socials = [
    'https://www.linkedin.com/in/wwilliam1908',
    'https://github.com/wwilliam98',
    'https://leetcode.com/IamCookie/',
];

function Header() {
    const [activeSection, setActiveSection] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection('#' + entry.target.id);
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );
        navLinks.forEach(({ href }) => {
            const el = document.querySelector(href);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <header className="sticky top-0 z-40 bg-gray-800/80 backdrop-blur border-b border-white/10">
            <div className="flex items-center justify-between max-w-6xl mx-auto px-4 sm:px-6 h-16">
                <a href="#hero" className="text-lg font-bold tracking-wide">
                    William<span className="text-[#38BDF8]">.</span>
                </a>

                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            className={`text-sm transition-colors duration-200 ${
                                activeSection === href
                                    ? 'text-[#38BDF8]'
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:flex items-center">
                    {socials.map((url) => (
                        <SocialIcon
                            key={url}
                            url={url}
                            fgColor="#9CA3AF"
                            bgColor="transparent"
                            style={{ height: 36, width: 36 }}
                        />
                    ))}
                </div>

                <button
                    className="md:hidden p-2 text-gray-300"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-nav"
                >
                    {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>

            {menuOpen && (
                <nav id="mobile-nav" className="md:hidden flex flex-col px-6 pb-4 space-y-3 bg-gray-800/95 border-b border-white/10">
                    {navLinks.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm ${
                                activeSection === href ? 'text-[#38BDF8]' : 'text-gray-300'
                            }`}
                        >
                            {label}
                        </a>
                    ))}
                    <div className="flex -ml-2">
                        {socials.map((url) => (
                            <SocialIcon
                                key={url}
                                url={url}
                                fgColor="#9CA3AF"
                                bgColor="transparent"
                                style={{ height: 36, width: 36 }}
                            />
                        ))}
                    </div>
                </nav>
            )}
        </header>
    )
}

export default Header
