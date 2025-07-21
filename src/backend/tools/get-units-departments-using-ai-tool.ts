import { tool } from 'ai'
import { z } from 'zod'

const DepartmentAIUsage = z.object({
  department: z
    .string()
    .describe('Name of the department (HR, IT, Marketing, etc.)'),
  aiSupport: z
    .string()
    .describe('Nature of AI support provided to this department'),
  adoptionLevel: z.string().describe('Level of AI adoption'),
  dependency: z.string().describe('Dependency level on AI tools'),
  automatedTasks: z
    .array(z.string())
    .describe('Tasks automated by AI in this department'),
})

const ConfirmationResponse = z.object({
  mentionedTools: z
    .array(z.string())
    .describe('AI tools mentioned by other employees that were asked about'),
  userConfirmation: z
    .string()
    .describe(
      "User's response about awareness of these tools (confirmed, denied, partial, etc.)",
    ),
  Reviews: z.string().optional().describe('Reviews about tool usage'),
})

export const GetUnitsDepartmentsUsingAITool = tool({
  description: `Use this tool to gather information about AI adoption across different departments and units.
  
  Ask about:
  - Other Departments using AI (HR, IT, Marketing, Sales, etc.)
  - Adoption levels of AI usage in each department
  - Dependency levels on AI tools
  
  Tool Example:
  AI: "Can you tell me about AI adoption in different departments?"
  User: "HR uses AI for drafting mails, shortlisting resumes, Data team uses tools for analysis"
  AI: "Makes sense! How dependent are the departments on these tools? 

 
  ❌NEVER Mention names of other employees
  ❌NEVER EVER mention which tool is being used to user.
  ❌NEVER ask more than two questions in a message
  ✅Generally react to user's reply with natural reactions (e.g., "Hmm", "Fair", "Makes sense") before follow-ups
  `,
  parameters: z.object({
    departments: z
      .array(DepartmentAIUsage)
      .describe('Array of departments and their AI usage patterns'),
    confirmation: ConfirmationResponse.optional().describe(
      'Confirmation of AI tools mentioned by other employees',
    ),
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
