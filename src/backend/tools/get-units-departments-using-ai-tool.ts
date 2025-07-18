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
  dependency: z
    .enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE'])
    .describe('Dependency level on AI tools'),
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
    
  Example:
  AI: "Can you tell me about AI adoption in different departments?"
  User: "HR uses AI for drafting mails, shortlisting resumes, Data team uses tools for analysis"
  AI: "Makes sense! How dependent are the departments on these tools? 

  CRITICAL FOLLOW UP: If system contexts contain other employees' AI tool usage, 
  ALWAYS confirm about others' claims-
  Example: 
    Contexts: 
    Context 1:"I'm Mark from HR. We use Midjourney for creating images." 
    Context 2:"I'm James from Legal. We use ChatGPT for reading documents, making statements."
  AI:"By the way,other employees mentioned using MidJourney in HR department, ChatGPT in Legal department for reading documents. Are you aware of their usage?"
  User:"Yes"
  AI: "What are their reviews?"
  ❌NEVER Mention names of other employees
  ❌NEVER EVER mention which tool is being used to user.
  ❌NEVER ask more than two questions in a message
  ✅Generally react to user's reply with natural responses like "Hmm", "Fair", "I see", "Makes sense", then ask further questions and ❌ Avoid writing messages longer than 50 words
  
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
