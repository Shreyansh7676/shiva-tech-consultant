// Local default fallback images for zero-downtime and offline support
import homeSlide1 from '../images/3.png';
import homeSlide2 from '../New folder/Project Management Institute.png';
import homeSlide3 from '../New folder/Untitled-2.png';

import techAdv1 from '../CarouselAdv/Untitled design(1).png';
import techAdv2 from '../CarouselAdv/photo_2024-11-01_16-05-44.jpg';
import techAdv3 from '../CarouselAdv/Beige Modern Cafe Brunch Event Flyer Business Instagram Post(1).png';

import asset1 from '../New folder/new.png';
import asset2 from '../New folder/Brown and Cream Modern Collective Instagram Post (Facebook Post).jpg';
import asset3 from '../CarouselAsset/unnamed.png';

import audit1 from '../CarouselAudit/photo_2024-11-01_16-00-11.jpg';
import audit2 from '../CarouselAudit/photo_2024-11-01_15-59-47.jpg';
import audit3 from '../CarouselAudit/Beige Modern Cafe Brunch Event Flyer Business Instagram Post.png';

import energy1 from '../New folder/bee-certification-services-500x500.webp';
import energy2 from '../New folder/photo_2024-10-27_21-59-43.jpg';

import project1 from '../New folder/Artboard 1.png';
import project2 from '../CarouselProject/unnamed (2).png';
import project3 from '../CarouselProject/unnamed.png';

import val1 from '../CarouselValuation/Untitled design.png';
import val2 from '../CarouselValuation/23232.png';
import val3 from '../CarouselValuation/photo_2024-11-01_16-07-47.jpg';

import value1 from '../New folder/photo_2024-10-25_21-19-17.jpg';
import value2 from '../New folder/unnamed.png';
import value3 from '../New folder/photo_2024-10-25_21-38-01.jpg';
import value4 from '../New folder/unnamed (1).png';

import mfgSpm from '../Portfolio/Manufacturing/photo_2024-11-02_14-01-32.jpg';
import mfgAir from '../Portfolio/Manufacturing/apcd.png';
import mfgStructure from '../Portfolio/Manufacturing/lol.png';
import mfgFab from '../Portfolio/Manufacturing/lol(1).png';

export const defaultImages = {
  home: {
    slides: [homeSlide1, homeSlide2, homeSlide3]
  },
  techadv: {
    slides: [techAdv1, techAdv2, techAdv3]
  },
  assetmanagement: {
    slides: [asset1, asset2, asset3]
  },
  energyaudit: {
    slides: [audit1, audit2, audit3]
  },
  energymanagement: {
    slides: [energy1, energy2, energy1]
  },
  projectmanagement: {
    slides: [project1, project2, project3]
  },
  valuation: {
    slides: [val1, val2, val3]
  },
  value: {
    slides: [value1, value2, value3, value4]
  },
  manufacturing: {
    panels: {
      spm: mfgSpm,
      airPollution: mfgAir,
      structure: mfgStructure,
      fabrication: mfgFab
    }
  },
  gallery: {
    photos: [
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80',
      'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1663616132598-e9a1ee3ad186?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1426260193283-c4daed7c2024?ixlib=rb-4.0.3&auto=format&fit=crop&w=1476&q=80',
      'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://plus.unsplash.com/premium_photo-1663012880499-47f1ca50459d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ]
  }
};

export default defaultImages;
