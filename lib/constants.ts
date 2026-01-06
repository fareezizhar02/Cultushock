export const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/homepg-01.jpg',
    alt: 'Fashion collection 1'
  },
  {
    id: 2,
    image: '/images/homepg-02.jpg',
    alt: 'Fashion collection 2'
  },
  {
    id: 3,
    image: '/images/homepg-03.jpg',
    alt: 'Fashion collection 3'
  },
];

export const NAV_LINKS = [
  { 
    label: 'Collections', 
    href: '/collections',
    subItems: [
      { label: 'Tops', href: '/collections/tops' },
      { label: 'Bottoms', href: '/collections/bottoms' }
    ]
  },
  { 
    label: 'Categories', 
    href: '/categories',
    subItems: [
      { label: 'Streetwear', href: '/categories/streetwear' },
      { label: 'Accessories', href: '/categories/accessories' }
    ]
  },
  { 
    label: 'Explore', 
    href: '/explore'
  }
];