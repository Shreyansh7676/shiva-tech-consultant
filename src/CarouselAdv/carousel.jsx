import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import usePageImages from '../content/usePageImages';
import '../carousel.css';

function ControlledCarousel() {
  const [index, setIndex] = useState(0);
  const images = usePageImages('techadv');
  const slides = images.slides || [];

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel className="site-portfolio-carousel" activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          style={{ height: '50vh', objectFit: 'contain' }}
          className="d-block w-100 rounded-lg"
          src={slides[0]}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          style={{ height: '50vh', objectFit: 'contain', background: 'black' }}
          className="d-block w-100 rounded-lg"
          src={slides[1]}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          style={{ height: '50vh', objectFit: 'contain' }}
          className="d-block w-100 rounded-lg"
          src={slides[2]}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
