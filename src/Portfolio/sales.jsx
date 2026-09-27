import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import usePageContent from '../content/usePageContent';
import usePageImages from '../content/usePageImages';
import RichContent from '../content/RichContent';

export default function Sales() {
  const sections = usePageContent('sales');
  const images = usePageImages('sales');
  const panelImages = images.panels || {};

  const panels = [
    ['spm', panelImages.spm],
    ['airPollution', panelImages.airPollution],
    ['structure', panelImages.structure],
    ['fabrication', panelImages.fabrication]
  ];

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <section className="site-page">
      <div className="site-page__container space-y-6">
        {panels.map(([id, image], index) => (
          <article
            key={id}
            className={`site-content-card grid items-center gap-6 lg:grid-cols-2 ${index % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}
            data-aos="fade-up"
          >
            <div className="flex items-center justify-center">
              <img src={image} className="h-64 w-full rounded-lg object-contain" alt="" />
            </div>
            <div>
              <RichContent html={sections[id]?.html} className="text-justify text-gray-600" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
