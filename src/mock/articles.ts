export interface ArticleItem {
  id: string;
  category: string;
  readTime: string;
  title: string;
  dek: string;
  featured?: boolean;
}

export interface DentalTipItem {
  id: string;
  title: string;
  summary: string;
  iconName: 'Clock' | 'Sparkles' | 'RefreshCw' | 'ShieldAlert';
}

export const HOME_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    category: 'Clinical',
    readTime: '7 min read',
    title: 'What five years of clear-aligner data actually says about adolescents',
    dek: 'A meta-analysis of twelve thousand adolescent orthodontic records reveals that biological compliance curves drop sharply at month four — but predictable retention hinges on a counter-intuitive staging protocol.',
    featured: true,
  },
  {
    id: 'art-2',
    category: 'Practice Management',
    readTime: '5 min read',
    title: 'The recall visit is quietly coming back. Here’s how practices are doing it well',
    dek: 'Automated SMS nudges have hit saturation. The independent practices posting 80%+ recall adherence are replacing generic blasts with diagnostic-linked communication.',
    featured: false,
  },
  {
    id: 'art-3',
    category: 'Patient Care',
    readTime: '4 min read',
    title: 'Ask the periodontist: what bleeding gums are really telling you',
    dek: 'Why subtle gingival inflammation remains medicine’s most overlooked vascular barometer, and how early intervention alters the trajectory of systemic inflammatory load.',
    featured: false,
  },
];

export const DENTAL_TIPS: DentalTipItem[] = [
  {
    id: 'tip-1',
    title: 'Floss first or brush first?',
    summary: 'Either works. The habit matters more than the order, though flossing first loosens debris for fluoride to reach interproximal surfaces.',
    iconName: 'Sparkles',
  },
  {
    id: 'tip-2',
    title: 'Why sugar timing beats sugar amount',
    summary: 'Enamel demineralization is triggered by duration of acid exposure. Grazing on sweets over four hours does vastly more harm than dessert eaten in fifteen minutes.',
    iconName: 'Clock',
  },
  {
    id: 'tip-3',
    title: 'When to replace your toothbrush',
    summary: 'Every 90 days, or immediately after a viral illness. Frayed nylon filaments lose their rounded tips and abrade gingival margins rather than cleaning them.',
    iconName: 'RefreshCw',
  },
  {
    id: 'tip-4',
    title: 'Night guards: worth it?',
    summary: 'For nocturnal bruxism, a custom-fitted occlusal splint prevents microfractures and vertical dimension loss that cost tens of thousands to rehabilitate later.',
    iconName: 'ShieldAlert',
  },
];
