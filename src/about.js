import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import usePageContent from './content/usePageContent';
import RichContent from './content/RichContent';
export default function About() { const sections = usePageContent('about'); useEffect(() => { AOS.init({ duration: 1200 }); }, []); return <section className="site-page"><div className="site-page__container space-y-8 md:space-y-12"><div className="site-content-card mx-auto max-w-5xl" data-aos="fade-up"><RichContent html={sections.introduction.html} className="text-justify text-gray-600" /></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-aos="fade-up">{['mission','vision','approach'].map((id) => <div key={id} className="site-content-card"><RichContent html={sections[id].html} className="text-justify text-gray-600" /></div>)}</div><div className="site-content-card mx-auto max-w-3xl" data-aos="fade-up"><RichContent html={sections.whyChooseUs.html} className="text-justify text-gray-600" /></div></div></section>; }
