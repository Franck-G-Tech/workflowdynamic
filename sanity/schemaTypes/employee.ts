import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'employee',
  title: 'Empleado',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre Completo',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Email utilizado en Clerk para autenticación',
      validation: (Rule) =>
        Rule.required()
          .email()
          .custom((email) => {
            if (email && !email.toLowerCase().endsWith('@empresa.com')) {
              return 'El email debe ser corporativo (@empresa.com)'
            }
            return true
          }),
    }),
    defineField({
      name: 'clerkId',
      title: 'Clerk ID',
      type: 'string',
      description: 'ID único de Clerk para vinculación',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'currentProject',
      title: 'Proyecto Actual',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Proyecto en el que trabaja actualmente',
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      type: 'string',
      options: {
        list: [
          { title: 'Empleado', value: 'employee' },
          { title: 'Project Manager', value: 'pm' },
          { title: 'Administrador', value: 'admin' },
        ],
        layout: 'radio',
      },
      initialValue: 'employee',
      validation: (Rule) => Rule.required(),
    }),
    // defineField({
    //   name: 'avatar',
    //   title: 'Foto de Perfil',
    //   type: 'image',
    //   options: {
    //     hotspot: true,
    //   },
    // }),
    // defineField({
    //   name: 'department',
    //   title: 'Departamento',
    //   type: 'string',
    //   options: {
    //     list: [
    //       'Desarrollo',
    //       'Diseño',
    //       'Marketing',
    //       'Ventas',
    //       'Recursos Humanos',
    //       'Finanzas',
    //       'Operaciones',
    //     ],
    //   },
    // }),
    // defineField({
    //   name: 'hireDate',
    //   title: 'Fecha de Contratación',
    //   type: 'date',
    // }),
    // defineField({
    //   name: 'isActive',
    //   title: 'Activo',
    //   type: 'boolean',
    //   description: 'Indica si el empleado está activo en la empresa',
    //   initialValue: true,
    // }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      const roleMap: Record<string, string> = {
        employee: 'Empleado',
        pm: 'Project Manager',
        admin: 'Administrador',
      }
      return {
        title: title as string,
        subtitle: roleMap[subtitle as string] || (subtitle as string),
        media,
      }
    },
  },
})