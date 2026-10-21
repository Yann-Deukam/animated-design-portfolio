export interface Project {
  id: number
  title: string
  category: string
  year: string
  src: string
  wide: boolean
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Aurum & Co. Identity',
    category: 'Brand Identity',
    year: '2024',
    src: '/images/projects/project-brand.jpg',
    wide: true,
  },
  {
    id: 2,
    title: 'Aesthetic Folio Platform',
    category: 'Web Design',
    year: '2024',
    src: '/images/projects/project-web.jpg',
    wide: false,
  },
  {
    id: 3,
    title: 'Luna Fragrance',
    category: 'Packaging Design',
    year: '2023',
    src: '/images/projects/project-packaging.jpg',
    wide: false,
  },
  {
    id: 4,
    title: 'Aura Fintech App',
    category: 'UI / UX Design',
    year: '2024',
    src: '/images/projects/project-app.jpg',
    wide: false,
  },
  {
    id: 5,
    title: 'Nox Motion Reel',
    category: 'Motion Design',
    year: '2023',
    src: '/images/projects/project-web.jpg',
    wide: false,
  },
  {
    id: 6,
    title: 'Serif Editorial Magazine',
    category: 'Editorial Print',
    year: '2023',
    src: '/images/projects/project-brand.jpg',
    wide: true,
  },
]