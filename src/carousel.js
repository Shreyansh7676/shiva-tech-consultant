import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from './images/3.png'
import img2 from './New folder/Project Management Institute.png'
import img3 from './New folder/Untitled-2.png'
import './carousel.css'

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel className="site-home-carousel" activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
      <img style={{height:'90vh',objectFit:'cover'}}
        className="d-block w-100"
        src={img1}
        alt="First slide"
      />
      <div className="absolute inset-0 bg-black opacity-45"></div>
        <Carousel.Caption className='flex flex-col h-100 items-center justify-center bottom-0'>
          <h4 className='text-3xl'>Looking for Sustainable Solutions ?</h4>
          <h5>Operational Systems, Energy Management, Engineering, Value Engineering & Emmissions </h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img style={{height:'90vh',objectFit:'cover', background:'black'}}
        className="d-block w-100"
        src={img2}
        alt="Second slide"
      />
      <div className="absolute inset-0 bg-black opacity-60"></div>
        <Carousel.Caption className='flex flex-col h-100 items-center justify-center bottom-0'>
          <h3 className='text-3xl'>Solutions</h3>
          <h5>Built on Expertise, Proven by Results</h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img style={{height:'90vh',objectFit:'cover'}}
        className="d-block w-100"
        src={img3}
        alt="Third slide"
      />
      <div className="absolute inset-0 bg-black opacity-55"></div>
        <Carousel.Caption className='flex flex-col h-100 items-center justify-center bottom-0'>
          <h3 className='text-3xl'>Approach</h3>
          <h5>
            Structured Approach yields More
          </h5>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
