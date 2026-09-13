import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../New folder/photo_2024-10-25_21-19-17.jpg'
import img2 from '../New folder/unnamed.png'
import img3 from '../New folder/photo_2024-10-25_21-38-01.jpg'
import img4 from '../New folder/unnamed (1).png'
import '../carousel.css'

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel className="site-portfolio-carousel" activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img style={{ height: '50vh', objectFit: 'contain' }}
          className="d-block w-100 rounded-lg"
          src={img1}
          alt="First slide"
        />

      </Carousel.Item>
      <Carousel.Item>
        <img style={{ height: '50vh', objectFit: 'contain', background: 'black' }}
          className="d-block w-100 rounded-lg"
          src={img2}
          alt="Second slide"
        />

      </Carousel.Item>
      <Carousel.Item>
        <img style={{ height: '50vh', objectFit: 'contain' }}
          className="d-block w-100 rounded-lg"
          src={img3}
          alt="Third slide"
        />

      </Carousel.Item>
      <Carousel.Item>
        <img style={{ height: '50vh', objectFit: 'contain' }}
          className="d-block w-100 rounded-lg"
          src={img4}
          alt="Fourth slide"
        />

      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
