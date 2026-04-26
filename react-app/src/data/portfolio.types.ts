export type AwardCode = '' | 'gd' | 'wa'

export interface FeaturedProject {
  projectKR: string
  projectEN: string
  type: string
  company: string
  role: string
  period: string
  descriptionKR: string
  descriptionEN: string
  skills: string[]
  awards: AwardCode[]
  dType: number
  color: string
  anim: string
  colPC: number
  rowPC: number
  colMO: number
  rowMO: number
  imgCol: number | string[]
  pointTxt?: string[]
}

export interface ProjectListItem {
  name: string
  txt: string
  date: string
}

export type ProjectGroups = Record<string, ProjectListItem[]>
