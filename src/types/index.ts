export interface WebsiteOption {
  id: string;
  name: string;
  logo: string;
  backgrounds?: string[];
  slideshowImages?: string[];
}

export interface RTPStyle {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
}

export interface BackgroundCategory {
  id: string;
  name: string;
  backgrounds: string[];
}

export interface TextRow {
  id: string;
  text: string;
}

export interface RightModalImage {
  id: string;
  url: string;
  name: string;
}

export interface GifConfig {
  websiteId: string;
  headerText: string;
  text1: string;
  text2: string;
  additionalTexts: TextRow[];
  footer1Text: string;
  searchBarText: string;
  rightModalTitle: string;
  rightModalImages: RightModalImage[];
  rightModalFooter: string;
  backgroundId: string;
  styleId: string;
}
