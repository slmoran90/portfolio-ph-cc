// Sample project data - in production, this would come from a database
export interface Project {
  id: string
  title: string
  category: "baby-shower" | "birthday" | "baptism"
  coverImage: string
  images: string[]
  date: string
  description: string
  location: string
}

export const projects: Project[] = [
  {
    id: "emmas-garden-baby-shower",
    title: "Emma's Garden Baby Shower",
    category: "baby-shower",
    coverImage: "/images/hero-baby-shower.jpg",
    images: [
      "/images/hero-baby-shower.jpg",
      "/images/gallery/gallery-1.jpg",
      "/images/gallery/gallery-4.jpg",
    ],
    date: "March 2024",
    description: "A beautiful garden-themed baby shower celebrating the upcoming arrival of baby Emma. Soft pastels, floral arrangements, and intimate moments with family and friends.",
    location: "Botanical Gardens, City Center",
  },
  {
    id: "lucas-5th-birthday",
    title: "Lucas's Magical 5th Birthday",
    category: "birthday",
    coverImage: "/images/featured-birthday.jpg",
    images: [
      "/images/featured-birthday.jpg",
      "/images/gallery/gallery-2.jpg",
      "/images/gallery/gallery-5.jpg",
    ],
    date: "February 2024",
    description: "A magical celebration filled with wonder, laughter, and pure childhood joy. Lucas's 5th birthday was a day to remember with colorful decorations and happy faces.",
    location: "The Celebration Hall",
  },
  {
    id: "sophia-baptism",
    title: "Sophia's Baptism Ceremony",
    category: "baptism",
    coverImage: "/images/featured-baptism.jpg",
    images: [
      "/images/featured-baptism.jpg",
      "/images/gallery/gallery-3.jpg",
      "/images/gallery/gallery-6.jpg",
    ],
    date: "January 2024",
    description: "A sacred and intimate ceremony celebrating Sophia's baptism. The soft light through the church windows created an ethereal atmosphere for this special day.",
    location: "St. Mary's Cathedral",
  },
  {
    id: "olivia-baby-shower",
    title: "Olivia's Bohemian Baby Shower",
    category: "baby-shower",
    coverImage: "/images/gallery/gallery-1.jpg",
    images: [
      "/images/gallery/gallery-1.jpg",
      "/images/gallery/gallery-4.jpg",
      "/images/hero-baby-shower.jpg",
    ],
    date: "December 2023",
    description: "A bohemian-inspired celebration with macramé decorations, dried flowers, and earthy tones. An afternoon filled with love and anticipation.",
    location: "Rustic Barn Venue",
  },
  {
    id: "noah-7th-birthday",
    title: "Noah's Adventure Birthday",
    category: "birthday",
    coverImage: "/images/gallery/gallery-5.jpg",
    images: [
      "/images/gallery/gallery-5.jpg",
      "/images/gallery/gallery-2.jpg",
      "/images/featured-birthday.jpg",
    ],
    date: "November 2023",
    description: "An adventure-themed celebration for a young explorer. Noah's 7th birthday featured outdoor games, treasure hunts, and endless excitement.",
    location: "Adventure Park",
  },
  {
    id: "james-baptism",
    title: "James's Christening Day",
    category: "baptism",
    coverImage: "/images/gallery/gallery-6.jpg",
    images: [
      "/images/gallery/gallery-6.jpg",
      "/images/gallery/gallery-3.jpg",
      "/images/featured-baptism.jpg",
    ],
    date: "October 2023",
    description: "A traditional christening ceremony surrounded by family and loved ones. James's special day was filled with blessings, joy, and heartfelt moments.",
    location: "Holy Trinity Church",
  },
]

export const categories = [
  { value: "all", label: "All Projects" },
  { value: "baby-shower", label: "Baby Showers" },
  { value: "birthday", label: "Birthdays" },
  { value: "baptism", label: "Baptisms" },
]

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id)
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === "all") return projects
  return projects.filter((project) => project.category === category)
}

export function getRelatedProjects(currentId: string, category: string, limit = 3): Project[] {
  return projects
    .filter((project) => project.id !== currentId && project.category === category)
    .slice(0, limit)
}
