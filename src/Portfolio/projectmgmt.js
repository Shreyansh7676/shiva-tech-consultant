import React, { useEffect } from 'react';
import CarouselLeft from '../CarouselProject/CarouselLeft';
import AOS from 'aos';
import 'aos/dist/aos.css';
import usePageContent from '../content/usePageContent';
import RichContent from '../content/RichContent';
export default function ProjectManagement() { const sections = usePageContent('projectmanagement'); useEffect(() => { AOS.init({ duration: 1200 }); }, []); return <section className="bg-gradient-to-t from-green-400 to-sky-500 py-16"><div className="mx-auto flex flex-col-reverse sm:flex-col gap-5 lg:flex-row max-w-7xl px-4 sm:px-6 lg:px-8"><div className="w-full md:max-w-md flex items-center justify-center rounded-lg" data-aos="fade-up"><CarouselLeft /></div><div className="mx-auto w-full md:max-w-2xl backdrop-blur-sm bg-white/30 py-5 rounded-lg px-4" data-aos="fade-up"><RichContent html={sections.main.html} className="text-justify leading-relaxed text-gray-600" /></div></div></section>; }
