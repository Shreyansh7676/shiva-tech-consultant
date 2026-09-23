import React, { useEffect } from 'react';
import AOS from 'aos';
import Img1 from './Manufacturing/photo_2024-11-02_14-01-32.jpg'; import Img2 from './Manufacturing/apcd.png'; import Img3 from './Manufacturing/lol(1).png'; import Img4 from './Manufacturing/lol.png';
import 'aos/dist/aos.css'; import usePageContent from '../content/usePageContent'; import RichContent from '../content/RichContent';
const panels = [['spm',Img1],['airPollution',Img2],['structure',Img4],['fabrication',Img3]];
export default function Manufacturing() { const sections = usePageContent('manufacturing'); useEffect(() => { AOS.init({ duration: 1200 }); }, []); return <section className="site-page"><div className="site-page__container space-y-6">{panels.map(([id,image], index) => <article key={id} className={`site-content-card grid items-center gap-6 lg:grid-cols-2 ${index % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`} data-aos="fade-up"><div className="flex items-center justify-center"><img src={image} className="h-64 w-full rounded-lg object-contain" alt="" /></div><div><RichContent html={sections[id].html} className="text-justify text-gray-600" /></div></article>)}</div></section>; }
