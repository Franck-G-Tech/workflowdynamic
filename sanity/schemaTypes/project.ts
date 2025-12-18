import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del Proyecto',
      type: 'string',
      description: 'Nombre del proyecto',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'projectManager',
      title: 'Project Manager',
      type: 'reference',
      to: [{ type: 'employee' }],
      description: 'Responsable del proyecto',
      validation: (Rule) => Rule.required(),
      options: {
        filter: 'role == "pm" || role == "admin"',
      },
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      description: 'Descripción detallada del proyecto',
      rows: 4,
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Planificación', value: 'planning' },
          { title: 'En Progreso', value: 'inProgress' },
          { title: 'Pausado', value: 'paused' },
          { title: 'Completado', value: 'completed' },
          { title: 'Cancelado', value: 'cancelled' },
        ],
      },
      initialValue: 'planning',
    }),
    defineField({
      name: 'startDate',
      title: 'Fecha de Inicio',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha de Fin',
      type: 'date',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Miembros del Equipo',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'employee' }],
        },
      ],
      description: 'Empleados asignados a este proyecto',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'projectManager.name',
      status: 'status',
    },
    prepare(selection) {
      const { title, subtitle, status } = selection
      const statusMap: Record<string, string> = {
        planning: 'Planificación',
        inProgress: 'En Progreso',
        paused: 'Pausado',
        completed: 'Completado',
        cancelled: 'Cancelado',
      }
      return {
        title: title as string,
        subtitle: `PM: ${subtitle || 'Sin asignar'} | ${statusMap[status as string] || status}`,
      }
    },
  },
})