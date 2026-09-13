import React, { useEffect } from 'react';
import Carousel from './carousel';
import AOS from 'aos';
import { useNavigate } from 'react-router-dom';
import 'aos/dist/aos.css';
import usePageContent from './content/usePageContent';
import RichContent from './content/RichContent';
export function HeroThree() { const navigate = useNavigate(); const sections = usePageContent('home'); useEffect(() => { AOS.init({ duration: 1200 }); }, []); return <div className="relative w-full"><Carousel /><section className="site-page"><div className="site-page__container"><div className="mx-auto max-w-2xl py-4 sm:py-8"><div className="mx-auto max-w-5xl text-center" data-aos="fade-up"><RichContent html={sections.hero.html} className="max-w-4xl text-2xl font-semibold text-gray-900 sm:text-2xl" /><div className="mt-8 flex items-center justify-center gap-x-2"><button type="button" onClick={() => navigate('/about')} className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80">About Us</button><button type="button" onClick={() => navigate('/contact')} className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm">Contact Us</button></div></div></div></div></section></div>; }
export default HeroThree;
