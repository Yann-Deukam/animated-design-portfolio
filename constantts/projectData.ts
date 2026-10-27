export interface Project {
  id: number
  slug: string
  title: string
  category: string
  year: string
  src: string
  wide: boolean
  description: string
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'aurum-co-identity',
    title: 'Aurum & Co. Identity',
    category: 'Brand Identity',
    year: '2024',
    src: '/images/projects/project-brand.jpg',
    wide: true,
    description:
      'A refined identity system for a contemporary jewelry house, balancing expressive typography with a restrained palette across its digital and print touchpoints.',
  },
  {
    id: 2,
    slug: 'aesthetic-folio-platform',
    title: 'Aesthetic Folio Platform',
    category: 'Web Design',
    year: '2024',
    src: '/images/projects/project-web.jpg',
    wide: false,
    description:
      'A portfolio platform designed to make an independent creative practice easy to explore, with clear case-study layouts and a calm editorial visual language.',
  },
  {
    id: 3,
    slug: 'luna-fragrance',
    title: 'Luna Fragrance',
    category: 'Packaging Design',
    year: '2023',
    src: '/images/projects/project-packaging.jpg',
    wide: false,
    description:
      'A packaging direction for a modern fragrance line, pairing tactile visual cues with a distinctive shelf presence and a coherent set of product applications.',
  },
  {
    id: 4,
    slug: 'aura-fintech-app',
    title: 'Aura Fintech App',
    category: 'UI / UX Design',
    year: '2024',
    src: '/images/projects/project-app.jpg',
    wide: false,
    description:
      'A clear, approachable mobile experience for everyday financial tasks, built around readable data, confident navigation and a reassuring visual system.',
  },
  {
    id: 5,
    slug: 'nox-motion-reel',
    title: 'Nox Motion Reel',
    category: 'Motion Design',
    year: '2023',
    src: '/images/projects/project-web.jpg',
    wide: false,
    description:
      'A motion-led visual reel exploring bold transitions, modular graphic elements and a consistent identity across campaign formats.',
  },
  {
    id: 6,
    slug: 'serif-editorial-magazine',
    title: 'Serif Editorial Magazine',
    category: 'Editorial Print',
    year: '2023',
    src: '/images/projects/project-brand.jpg',
    wide: true,
    description:
      'An editorial system for a culture magazine, using considered typography, flexible layouts and a strong image-led rhythm across print and digital.',
  },
]