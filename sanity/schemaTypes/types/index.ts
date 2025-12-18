// Tipos para Employee
export interface Employee {
  _id: string
  _type: 'employee'
  _createdAt: string
  _updatedAt: string
  _rev: string
  name: string
  email: string
  clerkId: string
  currentProject?: ProjectReference
  role: 'employee' | 'pm' | 'admin'
  // avatar?: {
  //   _type: 'image'
  //   asset: {
  //     _ref: string
  //     _type: 'reference'
  //   }
  // }
  // department?: string
  // hireDate?: string
  // isActive: boolean
}

// Tipos para Project
export interface Project {
  _id: string
  _type: 'project'
  _createdAt: string
  _updatedAt: string
  _rev: string
  name: string
  projectManager: EmployeeReference
  description?: string
  status: 'planning' | 'inProgress' | 'paused' | 'completed' | 'cancelled'
  startDate?: string
  endDate?: string
  teamMembers?: EmployeeReference[]
  slug: {
    _type: 'slug'
    current: string
  }
}

// Referencias
export interface EmployeeReference {
  _type: 'reference'
  _ref: string
  _key?: string
}

export interface ProjectReference {
  _type: 'reference'
  _ref: string
  _key?: string
}

// Enums
export enum EmployeeRole {
  EMPLOYEE = 'employee',
  PROJECT_MANAGER = 'pm',
  ADMIN = 'admin'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'inProgress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// export enum Department {
//   DEVELOPMENT = 'Desarrollo',
//   DESIGN = 'Diseño',
//   MARKETING = 'Marketing',
//   SALES = 'Ventas',
//   HR = 'Recursos Humanos',
//   FINANCE = 'Finanzas',
//   OPERATIONS = 'Operaciones'
// }