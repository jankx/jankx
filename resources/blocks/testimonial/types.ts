export interface TestimonialAttributes {
  author: string;
  role: string;
  company: string;
  date: string;
  rating: number;
  excerpt: string;
  avatarId: number;
  link: string;
  className?: string;
  anchor?: string;
}

export interface TestimonialProps {
  attributes: TestimonialAttributes;
  setAttributes: (attrs: Partial<TestimonialAttributes>) => void;
  clientId: string;
}

