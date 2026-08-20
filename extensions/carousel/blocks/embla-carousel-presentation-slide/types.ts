export type PresentationLayout = 'title' | 'split' | 'stats' | 'quote' | 'bullets';
export type PresentationTheme = 'dark' | 'light' | 'indigo' | 'slate' | 'forest';

export interface PresentationSlideAttributes {
  layout: PresentationLayout;
  title: string;
  subtitle: string;
  bodyText: string;
  bullets: string[];
  statsNumber: string;
  statsLabel: string;
  quoteText: string;
  quoteAuthor: string;
  quoteRole: string;
  theme: PresentationTheme;
  presenterNotes: string;
}

export interface PresentationSlideEditProps {
  attributes: PresentationSlideAttributes;
  setAttributes: (attrs: Partial<PresentationSlideAttributes>) => void;
  context: string[];
  isSelected: boolean;
}
