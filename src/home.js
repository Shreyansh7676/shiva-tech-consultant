import React, { useEffect } from 'react';
import Carousel from './carousel';
import AOS from 'aos';
import { useNavigate } from 'react-router-dom';
import 'aos/dist/aos.css';
import usePageContent from './content/usePageContent';
import RichContent from './content/RichContent';
export function HeroThree() { const navigate = useNavigate(); const sections = usePageContent('home'); useEffect(() => { AOS.init({ duration: 1200 }); }, []); return <div className="relative w-full h-4/5"><Carousel /><div className="relative isolate z-0 bg-gradient-to-t from-green-400 to-sky-500 px-6 py-16 lg:px-8"><div className="relative mx-auto max-w-2xl py-24"><div className="text-center max-w-5xl" data-aos="fade-up"><RichContent html={sections.hero.html} className="text-2xl max-w-4xl font-semibold text-gray-900 sm:text-2xl" /><div className="mt-10 flex items-center justify-center gap-x-2"><button type="button" onClick={() => navigate('/about')} className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80">About Us</button><button type="button" onClick={() => navigate('/contact')} className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm">Contact Us</button></div></div></div></div></div>; }
export default HeroThree;
