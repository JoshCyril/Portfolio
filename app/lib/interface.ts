import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface ProjectLink {
  title: string;
  url: string;
  description?: string;
}

export interface ProjectTag {
  title: string;
  tagImg: SanityImageSource;
}

export interface SimpleProject {
  title: string;
  proImg: SanityImageSource;
  link?: ProjectLink;
  slug: string;
  description: string;
  proDate: string;
  tags: ProjectTag[];
  tagCount: number;
  featured?: boolean;
}

export interface ProjectFilters {
  selectedTags: string[];
  searchQuery: string;
  sortBy:
    | "date-desc"
    | "date-asc"
    | "title-asc"
    | "title-desc"
    | "featured-first";
  featuredOnly: boolean;
}

export interface ProjectGalleryImage {
  asset: SanityImageSource;
}

export interface FullProject {
  title: string;
  proImg: SanityImageSource;
  summary: PortableTextBlock[];
  content: PortableTextBlock[];
  proDate: string;
  links: ProjectLink[];
  slug: string;
  description?: string;
  gallery: ProjectGalleryImage[];
  tags: ProjectTag[];
}

export interface AboutContent {
  tagline: string;
}

export interface CvPdf {
  fileURL: string;
}

export interface FooterData {
  copyright: string;
  udDate: Date | string;
}

export interface SkillTag {
  tag_name: string;
  tag_count: number;
  tag_url: SanityImageSource | null;
}

export interface AboutWithTags {
  about: Array<{
    content: PortableTextBlock[];
  }>;
  tags: SkillTag[];
}

export interface Ee3 {
  exp: Array<{
    title: string;
    yoe: string;
    content: PortableTextBlock[];
    company: {
      name: string;
      location: string;
      url: string;
      Img: SanityImageSource;
    };
  }>;
  edu: Array<{
    title: string;
    uni: {
      name: string;
      location: string;
      url: string;
      Img: SanityImageSource;
    };
  }>;
}
