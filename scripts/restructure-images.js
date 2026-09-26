const fs = require('fs');
const path = require('path');

const targetBase = path.join(__dirname, '..', 'firebase-storage-upload', 'site');

const manifest = {
  home: [
    { src: 'src/images/3.png', dest: 'home/slide-1.png' },
    { src: 'src/New folder/Project Management Institute.png', dest: 'home/slide-2.png' },
    { src: 'src/New folder/Untitled-2.png', dest: 'home/slide-3.png' }
  ],
  'portfolio/tech-advisory': [
    { src: 'src/CarouselAdv/Untitled design(1).png', dest: 'portfolio/tech-advisory/slide-1.png' },
    { src: 'src/CarouselAdv/photo_2024-11-01_16-05-44.jpg', dest: 'portfolio/tech-advisory/slide-2.jpg' },
    { src: 'src/CarouselAdv/Beige Modern Cafe Brunch Event Flyer Business Instagram Post(1).png', dest: 'portfolio/tech-advisory/slide-3.png' }
  ],
  'portfolio/asset-management': [
    { src: 'src/New folder/new.png', dest: 'portfolio/asset-management/slide-1.png' },
    { src: 'src/New folder/Brown and Cream Modern Collective Instagram Post (Facebook Post).jpg', dest: 'portfolio/asset-management/slide-2.jpg' },
    { src: 'src/CarouselAsset/unnamed.png', dest: 'portfolio/asset-management/slide-3.png' }
  ],
  'portfolio/energy-audit': [
    { src: 'src/CarouselAudit/photo_2024-11-01_16-00-11.jpg', dest: 'portfolio/energy-audit/slide-1.jpg' },
    { src: 'src/CarouselAudit/photo_2024-11-01_15-59-47.jpg', dest: 'portfolio/energy-audit/slide-2.jpg' },
    { src: 'src/CarouselAudit/Beige Modern Cafe Brunch Event Flyer Business Instagram Post.png', dest: 'portfolio/energy-audit/slide-3.png' }
  ],
  'portfolio/energy-management': [
    { src: 'src/New folder/bee-certification-services-500x500.webp', dest: 'portfolio/energy-management/slide-1.webp' },
    { src: 'src/New folder/photo_2024-10-27_21-59-43.jpg', dest: 'portfolio/energy-management/slide-2.jpg' },
    { src: 'src/New folder/bee-certification-services-500x500.webp', dest: 'portfolio/energy-management/slide-3.webp' }
  ],
  'portfolio/project-management': [
    { src: 'src/New folder/Artboard 1.png', dest: 'portfolio/project-management/slide-1.png' },
    { src: 'src/CarouselProject/unnamed (2).png', dest: 'portfolio/project-management/slide-2.png' },
    { src: 'src/CarouselProject/unnamed.png', dest: 'portfolio/project-management/slide-3.png' }
  ],
  'portfolio/valuation': [
    { src: 'src/CarouselValuation/Untitled design.png', dest: 'portfolio/valuation/slide-1.png' },
    { src: 'src/CarouselValuation/23232.png', dest: 'portfolio/valuation/slide-2.png' },
    { src: 'src/CarouselValuation/photo_2024-11-01_16-07-47.jpg', dest: 'portfolio/valuation/slide-3.jpg' }
  ],
  'portfolio/value-engineering': [
    { src: 'src/New folder/photo_2024-10-25_21-19-17.jpg', dest: 'portfolio/value-engineering/slide-1.jpg' },
    { src: 'src/New folder/unnamed.png', dest: 'portfolio/value-engineering/slide-2.png' },
    { src: 'src/New folder/photo_2024-10-25_21-38-01.jpg', dest: 'portfolio/value-engineering/slide-3.jpg' },
    { src: 'src/New folder/unnamed (1).png', dest: 'portfolio/value-engineering/slide-4.png' }
  ],
  'portfolio/manufacturing': [
    { src: 'src/Portfolio/Manufacturing/photo_2024-11-02_14-01-32.jpg', dest: 'portfolio/manufacturing/spm.jpg' },
    { src: 'src/Portfolio/Manufacturing/apcd.png', dest: 'portfolio/manufacturing/air-pollution.png' },
    { src: 'src/Portfolio/Manufacturing/lol.png', dest: 'portfolio/manufacturing/structure.png' },
    { src: 'src/Portfolio/Manufacturing/lol(1).png', dest: 'portfolio/manufacturing/fabrication.png' }
  ]
};

const galleryUrls = [
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80',
  'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1663616132598-e9a1ee3ad186?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1426260193283-c4daed7c2024?ixlib=rb-4.0.3&auto=format&fit=crop&w=1476&q=80',
  'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  'https://plus.unsplash.com/premium_photo-1663012880499-47f1ca50459d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
];

async function organize() {
  console.log('Restructuring images into: firebase-storage-upload/site/\n');

  // Copy carousel images
  let count = 0;
  for (const [section, files] of Object.entries(manifest)) {
    for (const item of files) {
      const srcPath = path.join(__dirname, '..', item.src);
      const destPath = path.join(targetBase, item.dest);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied [${item.src}] -> [site/${item.dest}]`);
      count++;
    }
  }

  // Download gallery images
  console.log('\nDownloading gallery images into site/gallery/...');
  const galleryDir = path.join(targetBase, 'gallery');
  fs.mkdirSync(galleryDir, { recursive: true });

  for (let i = 0; i < galleryUrls.length; i++) {
    const filename = `photo-${i + 1}.jpg`;
    const destPath = path.join(galleryDir, filename);
    const res = await fetch(galleryUrls[i]);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    console.log(`Downloaded photo-${i + 1}.jpg (${(buffer.length / 1024).toFixed(1)} KB) -> [site/gallery/${filename}]`);
  }

  console.log(`\nDone! Successfully restructured all ${count} carousel images and 9 gallery images into:`);
  console.log(`📂 ${targetBase}`);
}

organize().catch(console.error);
