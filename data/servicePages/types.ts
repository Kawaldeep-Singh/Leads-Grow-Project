export interface ServicePageContent {
  slug: string;
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    flow: readonly string[];
  };
  what: {
    title: string;
    paragraphs: readonly string[];
  };
  services: {
    eyebrow: string;
    title: string;
    items: readonly string[];
  };
  why: {
    eyebrow: string;
    title: string;
    stats: readonly { value: string; label: string }[];
  };
  process: {
    eyebrow: string;
    title: string;
    steps: readonly { title: string; text: string }[];
  };
  industries: { title: string };
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    button: string;
  };
}
