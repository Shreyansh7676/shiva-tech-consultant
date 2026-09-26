import Carousel from './components/Carousel';
import usePageImages from './content/usePageImages';

// Captions are optional and positional: slides beyond this list simply render
// without a caption, since the number of hero images is not fixed.
const captions = [
  <>
    <h4 className="text-3xl">Looking for Sustainable Solutions ?</h4>
    <h5>Operational Systems, Energy Management, Engineering, Value Engineering & Emmissions </h5>
  </>,
  <>
    <h3 className="text-3xl">Solutions</h3>
    <h5>Built on Expertise, Proven by Results</h5>
  </>,
  <>
    <h3 className="text-3xl">Approach</h3>
    <h5>Structured Approach yields More</h5>
  </>
];

const overlays = ['opacity-45', 'opacity-60', 'opacity-55'];

function ControlledCarousel() {
  const images = usePageImages('home');
  const slides = images.slides || [];

  return (
    <Carousel className="site-home-carousel">
      {slides.map((src, index) => (
        <Carousel.Item key={index}>
          <img
            style={{ height: '90vh', objectFit: 'cover' }}
            className="d-block w-100"
            src={src}
            alt={`Slide ${index + 1}`}
          />
          <div className={`absolute inset-0 bg-black ${overlays[index] || 'opacity-50'}`}></div>
          {captions[index] && (
            <Carousel.Caption className="flex flex-col h-100 items-center justify-center bottom-0">
              {captions[index]}
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ControlledCarousel;
