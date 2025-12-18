// schemas/index.ts
import project from './project'
import employee from './employee'

export const schemaTypes = [project, employee]

// Exportar tipos para uso externo
export type { 
  Employee, Project, EmployeeRole, ProjectStatus, //Department 
} from './types'