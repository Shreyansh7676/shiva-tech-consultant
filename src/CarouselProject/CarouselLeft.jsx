import Carousel from '../components/Carousel';
import usePageImages from '../content/usePageImages';

function ControlledCarousel() {
  const images = usePageImages('projectmanagement');
  const slides = images.slides || [];

  return (
    <Carousel className="site-portfolio-carousel">
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

export default ControlledCarousel;
