// schemas/vacationRequest.ts
import { defineType, defineField, defineArrayMember } from 'sanity'

interface AnswerPreview {
  title?: string
  subtitle?: string | boolean
  media?: unknown
}

interface Selection {
  title?: string
  subtitle?: string
  start?: string
  end?: string
}

export default defineType({
  name: 'vacationRequest',
  title: 'Solicitud de Vacaciones',
  type: 'document',
  fields: [
    defineField({
      name: 'user_id',
      title: 'Usuario',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      description: 'Motivo de la solicitud de vacaciones'
    }),
    defineField({
      name: 'start_day',
      title: 'Día de inicio',
      type: 'date',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'end_day',
      title: 'Día de fin',
      type: 'date',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'answers',
      title: 'Respuestas',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'answer',
          fields: [
            defineField({
              name: 'id_user',
              title: 'Usuario que responde',
              type: 'reference',
              to: [{ type: 'user' }]
            }),
            defineField({
              name: 'answer',
              title: 'Respuesta',
              type: 'boolean',
              description: 'Aprobado (true) o Rechazado (false)'
            }),
            defineField({
              name: 'coment',
              title: 'Comentario',
              type: 'text'
            })
          ],
          preview: {
            select: {
              title: 'id_user.name',
              subtitle: 'answer',
              media: 'id_user.image'
            },
            prepare: (selection: AnswerPreview) => {
              const { title, subtitle } = selection
              const answerText = 
                subtitle === true ? 'Aprobado' : 
                subtitle === false ? 'Rechazado' : 
                'Sin respuesta'
              
              return {
                title: title || 'Sin usuario',
                subtitle: answerText
              }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'En progreso', value: 'progress' },
          { title: 'Aprobado', value: 'aprove' },
          { title: 'Rechazado', value: 'reject' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'user_id.name',
      subtitle: 'status',
      start: 'start_day',
      end: 'end_day'
    },
    prepare: (selection: Selection) => {
      const { title, subtitle, start, end } = selection
      
      const statusMap: Record<string, string> = {
        'progress': 'En progreso',
        'aprove': 'Aprobado',
        'reject': 'Rechazado'
      }
      
      return {
        title: `${title} - ${statusMap[subtitle || ''] || subtitle}`,
        subtitle: start && end ? `${start} al ${end}` : 'Sin fechas definidas'
      }
    }
  }
})