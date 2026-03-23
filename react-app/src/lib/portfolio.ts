import { featuredProjects } from '../data/portfolio.data'

export function toProjectKey(projectName: string) {
  return projectName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
}

export function getProjectVisualPath(projectName: string) {
  return `/assets/images/works/${toProjectKey(projectName)}/visual.png`
}

export function getProjectBySlug(slug?: string) {
  if (!slug) {
    return null
  }

  return featuredProjects.find((project) => toProjectKey(project.projectEN) === slug) ?? null
}

export function getProjectNeighbors(slug?: string) {
  const currentIndex = featuredProjects.findIndex(
    (project) => toProjectKey(project.projectEN) === slug,
  )

  if (currentIndex < 0) {
    return {
      currentIndex,
      nextProject: null,
      previousProject: null,
    }
  }

  return {
    currentIndex,
    previousProject: featuredProjects[currentIndex - 1] ?? null,
    nextProject: featuredProjects[currentIndex + 1] ?? null,
  }
}
