import Carousel from './Carousel';
import usePageImages from '../content/usePageImages';

export default function PageCarousel({ pageId, className = 'site-portfolio-carousel' }) {
  const images = usePageImages(pageId);
  const slides = images.slides || [];

  // Nothing uploaded for this page yet: keep the slot so the layout holds its
  // shape and future images have a place to land.
  if (!slides.length) {
    return <div className={`${className} xc-carousel-empty`} aria-hidden="true" />;
  }

  return (
    <Carousel className={className}>
      {slides.map((src, index) => (
        <Carousel.Item key={index}>
          <img
            style={{ height: '50vh', objectFit: 'contain', background: index === 1 ? 'black' : undefined }}
            className="d-block w-100 rounded-lg"
            src={src}
            alt={`Slide ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
