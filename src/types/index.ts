export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  metric?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  date: string;
  image?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  publishedAt: string;
}

export interface NavItem {
  label: string;
  href: string;
}
