import { SchemaTypeDefinition } from 'sanity'
import user from './user'
import vacationRequest from './vacationRequest'
import { workflow } from './workflow'

export const schemaTypes: SchemaTypeDefinition[] = [user, vacationRequest, workflow]