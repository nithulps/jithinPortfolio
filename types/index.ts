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
  heroPhrases: string[];
  heroDescription: string;
  headline: string;
  aboutPhrases: string[];
  bioParagraphs: string[];
  image: string;
  resumeUrl: string;
  competencyText: string;
  socials: { linkedin?: string; github?: string; twitter?: string; instagram?: string };
}
