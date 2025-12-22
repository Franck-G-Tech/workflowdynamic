export const workflow = {
  name: 'workflow',
  title: 'Workflow',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Workflow Title',
      type: 'string',
    },
    {
      name: 'triggerId',
      title: 'Trigger ID (Event Name)',
      type: 'string', 
      description: 'Ej: user.signup'
    },
    {
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'action',
          fields: [
            { name: 'actionType', type: 'string', options: { list: ['send_email', 'slack_msg'] } },
            { name: 'message', type: 'string' }
          ]
        },
        {
          type: 'object',
          name: 'delay',
          fields: [
            { name: 'durationMs', type: 'number', title: 'Duration (ms)' }
          ]
        },
        {
          type: 'object',
          name: 'approval',
          title: 'Wait for Approval',
          fields: [
            { 
              name: 'timeout', 
              type: 'string', 
              title: 'Aprove or Reject', 
              initialValue: '24h'
            },
            { 
              name: 'approverEmail', 
              type: 'string', 
              title: 'Approver Email (Security)',
              description: 'Solo este email podrá aprobar el paso.'
            }
          ]
        }
      ]
    }
  ]
}