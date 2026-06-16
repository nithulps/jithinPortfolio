// Shared, serialisable data-transfer types used across server and client.

export interface ProjectDTO {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  excerpt: string;
  description: string;
  coverImage: string;
  visuals: string[];
  client: string;
  role: string;
  year: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  overlayTitle: string;
  overlaySub: string;
}

export interface ServiceDTO {
  _id: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  order: number;
}

export interface AboutDTO {
  _id: string;
  name: string;
  logo?: string;
  heroPhrases: string[];
  heroDescription: string;
  headline: string;
  aboutPhrases: string[];
  bioParagraphs: string[];
  image: string;
  resumeUrl: string;
  competencyText: string;
  roleLabel?: string;
  statusText?: string;
  footerHeading?: string;
  footerSubtitle?: string;
  contact?: {
    heading?: string;
    pill?: string;
    infoHeading?: string;
    infoParagraphs?: string[];
    email?: string;
    phone?: string;
    address?: string;
  };
  socials: { linkedin?: string; github?: string; twitter?: string; instagram?: string };
}

export interface PageDTO {
  _id: string;
  title: string;
  slug: string;
  heading: string;
  subtitle: string;
  description: string;
  image: string;
  categories: { key: string; name: string; coverImage: string; overlayTitle: string; overlaySubtitle: string }[];
  sections: { sectionTitle: string; sectionSlug: string; sectionBody: string; sectionImage: string; sectionFiles: string[]; showOnHomepage: boolean; sectionOverlayTitle: string; sectionOverlaySub: string; categoryKey: string }[];
  showInNavbar: boolean;
  navLabel: string;
  showOnHomepage: boolean;
  homepageExcerpt: string;
  order: number;
  builtIn: boolean;
  builtInKey: string;
  displayMode: "list" | "grid";
  gridColumns: 2 | 3;
}
