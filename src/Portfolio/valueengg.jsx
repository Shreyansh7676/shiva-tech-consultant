import React, { useEffect } from 'react';
import CarouselLeft from '../CarouselValue/Carousel';
import AOS from 'aos';
import 'aos/dist/aos.css';
import usePageContent from '../content/usePageContent';
import RichContent from '../content/RichContent';
export default function ValueEngineering() { const sections = usePageContent('value'); useEffect(() => { AOS.init({ duration: 1200 }); }, []); return <section className="site-page"><div className="site-portfolio-layout"><div className="site-portfolio-media" data-aos="fade-up"><CarouselLeft /></div><div className="site-content-card" data-aos="fade-up"><RichContent html={sections.main.html} className="text-justify leading-relaxed text-gray-600" /></div></div></section>; }
