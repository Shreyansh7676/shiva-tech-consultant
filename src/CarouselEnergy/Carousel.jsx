import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../New folder/bee-certification-services-500x500.webp'
import img2 from '../New folder/photo_2024-10-27_21-59-43.jpg'
import '../carousel.css'

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel className="site-portfolio-carousel" activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
      <img style={{height:'50vh',objectFit:'contain'}}
        className="d-block w-100 rounded-lg"
        src={img1}
        alt="First slide"
      />
        
      </Carousel.Item>
      <Carousel.Item>
      <img style={{height:'50vh',objectFit:'contain', background:'black'}}
        className="d-block w-100 rounded-lg"
        src={img2}
        alt="Second slide"
      />
      
      </Carousel.Item>
      <Carousel.Item>
      <img style={{height:'50vh',objectFit:'contain'}}
        className="d-block w-100 rounded-lg"
        src={img1}
        alt="Third slide"
      />
      
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
