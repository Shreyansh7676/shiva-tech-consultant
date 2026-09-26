import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import usePageContent from './content/usePageContent';
import usePageImages from './content/usePageImages';
import RichContent from './content/RichContent';

export function CardTwo() {
  const sections = usePageContent('gallery');
  const images = usePageImages('gallery');
  const posters = images.photos || [];

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <section className="site-page">
      <div className="site-page__container">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posters.map((poster, index) => (
            <div key={`${poster}-${index}`} className="overflow-hidden rounded-lg border bg-white" data-aos="fade-up">
              <img src={poster} className="aspect-video w-full rounded-md object-cover" alt="" />
              <div className="min-h-min p-4">
                <RichContent html={sections[`card${index + 1}`]?.html} className="text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CardTwo;
