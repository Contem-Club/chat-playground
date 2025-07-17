import { tool } from 'ai'
import { z } from 'zod'

const DepartmentAIUsage = z.object({
  department: z
    .string()
    .describe('Name of the department (HR, IT, Marketing, etc.)'),
  aiSupport: z
    .string()
    .describe('Nature of AI support provided to this department'),
  adoptionLevel: z
    .enum(['HIGH', 'MEDIUM', 'LOW', 'NONE', 'UNKNOWN'])
    .describe('Level of AI adoption'),
  frequency: z
    .enum(['All the time', 'Sometimes', 'Not much', 'RARELY', 'UNKNOWN'])
    .describe('Frequency of AI usage'),
  dependency: z
    .enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE'])
    .describe('Dependency level on AI tools'),
  automatedTasks: z
    .array(z.string())
    .describe('Tasks automated by AI in this department'),
})

export const GetUnitsDepartmentsUsingAITool = tool({
  description: `Use this tool to gather information about AI adoption across different departments and units.
  
  Ask about:
  - Other Departments using AI (HR, IT, Marketing, Sales, etc.)
  - Adoption levels of AI usage in each department
  - Dependency levels on AI tools
  
  ❌NEVER EVER mention which tool is being used to user.
  ❌NEVER ask more than two questions in a message
  ✅Generally react to user's reply in 10 words, then ask further questions and ❌ Avoid writing messages longer than 50 words
  ❌Avoid lengthening questions in a single message using 'and'. 
  ✅ALWAYS Put each sentence on a new line for better readability
  📌Keeping conversation friendly, but professional is essential
  
    
  Example:
  AI: "Can you tell me about AI adoption in different departments?"
  User: "HR uses AI for drafting mails, shortlisting resumes, Data team uses tools for analysis"
  AI: "Makes sense! How dependent are the departments on these tools? 
  `,
  parameters: z.object({
    departments: z
      .array(DepartmentAIUsage)
      .describe('Array of departments and their AI usage patterns'),
    extractedFromMessage: z
      .string()
      .describe('The user message this information was extracted from'),
  }),

  execute: async ({ departments, extractedFromMessage }) => {
    const departmentData = {
      departments,
      extractedFromMessage,
      timestamp: new Date().toISOString(),
    }

    console.log(
      'Department AI usage gathered:',
      JSON.stringify(departmentData, null, 2),
    )

    const deptNames = departments.map((d) => d.department).join(', ')
    return `Gathered AI usage information for ${departments.length} department(s): ${deptNames}. Thank you for the departmental insights!`
  },
})
