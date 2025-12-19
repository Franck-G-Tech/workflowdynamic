import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'user',
  title: 'Usuario',
  type: 'document',
  fields: [
    defineField({
      name: 'clerk_id',
      title: 'ID de Clerk',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Correo electrónico',
      type: 'string',
      validation: (Rule) => Rule.required().email()
    }),
    defineField({
      name: 'days_break',
      title: 'Días de descanso',
      type: 'number',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({
      name: 'rol',
      title: 'Roles',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Project Manager', value: 'pm' },
          { title: 'Desarrollador', value: 'dev' },
          { title: 'Administrador', value: 'admin' }
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'start_workday',
      title: 'Hora de inicio de jornada',
      type: 'number',
      description: 'Hora en formato 24h (ej: 9 para 9:00 AM)',
      validation: (Rule) => Rule.min(0).max(23).integer()
    }),
    defineField({
      name: 'date_create',
      title: 'Fecha de creación',
      type: 'datetime',
      readOnly: true,
      initialValue: (): string => new Date().toISOString()
    }),
    defineField({
      name: 'date_update',
      title: 'Fecha de actualización',
      type: 'datetime',
      readOnly: true,
      initialValue: (): string => new Date().toISOString()
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email'
    }
  }
})