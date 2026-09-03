export type Category = "Development" | "Design" | "UX/UI" | "E-commerce" | "App";

export interface ProjectImage {
  url: string;
  background?: string | { light?: string; dark?: string };
  bg?: string | { light?: string; dark?: string };
  padding?: string;
}

export type ProjectMedia = string | ProjectImage;

export interface Project {
  id: string;
  name: string;
  date: string;
  description: string;
  images: ProjectMedia[];
  categories: Category[];
}

export const getMediaUrl = (media: ProjectMedia): string =>
  typeof media === "string" ? media : media.url;

export const getMediaBackground = (
  media: ProjectMedia
): string | { light?: string; dark?: string } | undefined =>
  typeof media === "string" ? undefined : media.background || media.bg;

export const getMediaPadding = (media: ProjectMedia): string | undefined =>
  typeof media === "string" ? undefined : media.padding;

export const allProjects: Project[] = [
  {
    id: "iou-studio",
    images: [
      {
        url: "/images/iouHomePageRadius.png",
        background: "#303030ff",
        padding: "3rem"
      },
      {
        url: "/images/iou-studio-collections.png",
        background: "#859d8c",
        padding: "3rem",
      },
      {
        url: "/images/iou.screen8.png",
        background: "#303030ff",
        padding: "3rem" },
      {
        url: "/images/iou.screen1.png",
        background: "#303030ff",
        padding: "3rem" 
      },
      {
        url: "/images/iou.screen5.png",
        background: "#303030ff",
        padding: "3rem" 
      },
    ],
    name: "IOU Studio",
    date: "July 2026",
    description: "Web development, design and e-commerce.",
    categories: ["Development", "Design", "UX/UI", "E-commerce"],
  },
  {
    id: "plygrnd",
    images: [
      "/images/plygrndDeskUpFront.webp",
      "/images/plygrndMockkk.PNG",
      {
        url: "/images/plygrnd.screen0.webp",
        background: "#2a2a2a",
        padding: "3rem"
      },
      {
        url: "/images/plygrnd.screen100.webp",
        background: "#2a2a2a",
        padding: "3rem"
      },
    ],
    name: "Plygrnd",
    date: "February 2026",
    description: "Web design and development.",
    categories: ["Development", "Design"],
  },
  {
    id: "celia",
    images: [
      "/images/celiaMockup.PNG",
      "/images/celiaMockupDiary.PNG",
      "/images/celiaMockupProfile.PNG"
    ],
    name: "Celia",
    date: "July 2026",
    description: "App development and UX/UI design.",
    categories: ["Development", "App", "UX/UI"],
  },
  {
    id: "marlon-spata",
    images: [
      "/images/marlBackdrop.jpg",
      {
        url: "/images/marl02.webp",
        background: "#34343f",
        padding: "3rem"
      },
      {
        url: "/images/marl05.webp",
        background: "#34343f",
        padding: "3rem"
      },
      {
        url: "/images/marl04.webp",
        background: "#34343f",
        padding: "3rem"
      },
    ],
    name: "Marlon Spata",
    date: "April 2026",
    description: "Web design and development.",
    categories: ["Development", "Design", "UX/UI"],
  },
  {
    id: "sot-webshop",
    images: [
      "/images/sotDeskUp.webp",
      "/images/sotUpMobileMid.webp",
      "/images/sotWeb02.webp",
      {url: "/images/SOTwebClip.mp4",
      background: "#d7d1c7",
      padding: "3rem"},
      "/images/sot17MobileUp.webp",
    ],
    name: "SOT Stockholm",
    date: "February 2024",
    description: "Web design and development.",
    categories: ["Development", "Design", "UX/UI", "E-commerce"],
  },
  {
    id: "looplib",
    images: [
      "/images/looblipDeskUpfront.webp",
      "/images/loopLibScreen.webp",
      {
        url: "/images/loopLibShop.webp",
        background: "#cecece",
        padding: "3rem"
      },
      "/images/loopLibUpMobileMid.webp",
      "/images/loopLibLightScreen.webp",
    ],
    name: "LoopLib",
    date: "October 2023",
    description:
      "Web design and automation for a Shopify-hosted website specializing in loop kits and sample packs for music production. The project included designing a fully custom Shopify theme, with tailored product, cart, and checkout pages. Each section was built with unique forms and user flows. The goal was to create a seamless and visually cohesive journey from browsing to purchase.",
    categories: ["Development", "Design", "UX/UI", "E-commerce"],
  },
  {
    id: "audio-2-reel",
    images: [
      "/images/audio2reelWback.png",
      {
        url: "/images/audio2reelBHeljoe.webp",
        background: "#ffb384",
        padding: "3rem",
      },
      {
        url: "/images/audio2reelWhomeFit.webp",
        background: "#e45238",
        padding: "3rem",
      },
    ],
    name: "Audio 2 Reel",
    date: "April 2026",
    description:
      "Web design and automation for a Shopify-hosted website specializing in loop kits and sample packs for music production. The project included designing a fully custom Shopify theme, with tailored product, cart, and checkout pages. Each section was built with unique forms and user flows. The goal was to create a seamless and visually cohesive journey from browsing to purchase.",
    categories: ["Development", "UX/UI"],
  },
  {
    id: "socker-sucker",
    images: [
      "/images/sockerSuckerWebpage1.webp",
      "/images/sockerSucker2Mobile.webp",
      "/images/sockerSuckerWebpage.webp",
    ],
    name: "Socker Sucker",
    date: "October 2022",
    description:
      "Web design and digital presence for Socker Sucker, a Stockholm based pâtisserie and café. The project involved designing and developing a playful and bold website that reflects the brand’s visual identity. The site was built with a focus on mobile responsiveness, clear product presentation, and an intuitive layout that mirrors the physical experience of the café. Special attention was given to showcasing seasonal pastries, events, and social media integration to strengthen the café’s digital reach.",
    categories: ["Development", "UX/UI"],
  },
  // {
  //   id: "incense-collection",
  //   images: [
  //     "/images/agrumeappelbild.webp",
  //     "/images/godajfappelbild.webp",
  //     "/images/mastikappelbild.webp",
  //   ],
  //   name: "Incense Collection",
  //   date: "Sep 2024",
  //   description: "Branding, creative direction & design.",
  //   categories: ["Design"],
  // },
  // {
  //   id: "magazine",
  //   images: [
  //     "/images/SOTMagMock_04.webp",
  //     "/images/SOTMagcoverplastic10.webp",
  //     "/images/SOTMagMock_01.webp",
  //     "/images/sotmagpage2526.webp",
  //     "/images/sotmagcoverlouis.webp",
  //     "/images/SOTMagcoverplastic2.webp",
  //   ],
  //   name: "Magazine Concept",
  //   date: "Aug 2024",
  //   description:
  //     "Magazine layout, visual storytelling & creative direction.",
  //   categories: ["Design"],
  // },
  // {
  //   id: "launch-event",
  //   images: [
  //     "/images/launcheinvite30th.webp",
  //     "/images/launchE-invite3.webp",
  //   ],
  //   name: "Launch Event",
  //   date: "May 2024",
  //   description: "Invitation design and branding.",
  //   categories: ["Design"],
  // },
  // {
  //   id: "packaging",
  //   images: [
  //     "/images/sotPackSylwia6.webp",
  //     "/images/sotPackSylwia.webp",
  //     "/images/mastikpacksottext3.webp",
  //     "/images/sotPackSylwia3.webp",
  //     "/images/sotPackSylwia5.webp",
  //     "/images/sotPackSylwia2.webp",
  //   ],
  //   name: "Incense Packaging",
  //   date: "May 2024",
  //   description: "Packaging design, concept to production.",
  //   categories: ["Design"],
  // },
  // {
  //   id: "maya-nilsen",
  //   images: [
  //     "/images/SOTMayaAGRUMEside.webp",
  //     "/images/SOTMayaGODAJFside.webp",
  //     "/images/SOTMayaMASTIKside.webp",
  //     "/images/incensemayaimg2text.webp",
  //     "/images/incensemayaimg1text.webp",
  //     "/images/goodincense4mastik.webp",
  //   ],
  //   name: "Maya Nilsen",
  //   date: "Apr 2024",
  //   description: "Art direction, concept & design.",
  //   categories: ["Design"],
  // },
  // {
  //   id: "rob-p",
  //   images: [
  //     "/images/robP6.webp",
  //     "/images/robP4.webp",
  //     "/images/robP.webp",
  //     "/images/robP2.webp",
  //   ],
  //   name: "Rob P",
  //   date: "Mars 2024",
  //   description: "Visuals & post-production.",
  //   categories: ["Design"],
  // },
  // {
  //   id: "sot-underbron",
  //   images: ["/images/SOTUnderbronfinal1.webp"],
  //   name: "SOT x Underbron",
  //   date: "Dec 2023",
  //   description: "Branding & design.",
  //   categories: ["Design"],
  // },
  // {
  //   id: "kwizz-app",
  //   images: [
  //     "/images/KwizzAppMockup1.webp",
  //     "/images/KwizzAppMockup2.webp",
  //     "/images/quizAppMobile.webp",
  //   ],
  //   name: "Kwizz App",
  //   date: "Jan 2025",
  //   description:
  //     "Design and development of a custom quiz application built with React, Vite, and Express. The app allows users to create personalized quizzes with 1-15 questions and save them locally using browser based storage. Each quiz can be played directly after creation or accessed later from the stored list. The user interface was designed for simplicity and speed, with a smooth singlepage experience powered by React and optimized for performance with Vite. Local storage handling enables persistent data without the need for backend integration.",
  //   categories: ["Development", "UX/UI"],
  // },
  // {
  //   id: "the-kitchen",
  //   images: [
  //     "/images/theKitchenHome.webp",
  //     "/images/theRestaurantWebpage3.webp",
  //     "/images/theKitchenContact2.webp",
  //     "/images/theKitchenBooking.webp",
  //   ],
  //   name: "The Kitchen",
  //   date: "Feb 2025",
  //   description:
  //     "Responsive restaurant booking web application built with React, TypeScript, and Tailwind CSS. Users can search for available tables and instantly see open time slots for the next three days via an integrated third-party booking API, then confirm reservations through an API-driven interface. A dedicated admin dashboard offers full CRUD functionality for managing bookings, streamlining daily operations for restaurant staff. The entire system is designed for responsiveness and smooth user experience across all devices, ensuring intuitive interaction for both guests and administrators.",
  //   categories: ["Development", "UX/UI"],
  // },
];

export const projects = allProjects;
export default allProjects;
