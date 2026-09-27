import Carousel from './Carousel';
import usePageImages from '../content/usePageImages';

export default function PageCarousel({ pageId, className = 'site-portfolio-carousel' }) {
  const images = usePageImages(pageId);
  const slides = images.slides || [];

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
