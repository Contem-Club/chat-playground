import { tool } from 'ai'
import { z } from 'zod'

export const GetCompanyInfoTool = tool({
  description: `Use this tool to gather basic company information and user details.
  
  Call this tool when the user provides information about:
  - Company name and sector/industry
  - User's role and position
  - User's department, or vertical
  
  ❌NEVER EVER mention which tool is being used to user.
  ❌NEVER ask more than two questions in a message
  ✅Generally react to user's reply in 10 words, then ask further questions
  ❌ Avoid writing messages longer than 50 words
  ❌Avoid lengthening questions in a single message using 'and'. 
  ✅ALWAYS Put each sentence on a new line for better readability
  📌Keeping conversation friendly, but professional is essential
  
  
  `,
  
  parameters: z.object({
    companyName: z.string().optional().describe('Name of the company'),
    companySector: z
      .string()
      .optional()
      .describe('Industry or sector the company operates in'),
    userRole: z.string().optional().describe("User's job title or role"),
    userTeam: z
      .string()
      .optional()
      .describe("User's department, or vertical"),
    extractedFromMessage: z
      .string()
      .describe('The user message this information was extracted from'),
  }),

  execute: async ({
    companyName,
    companySector,
    userRole,
    userTeam,
    extractedFromMessage,
  }) => {
    const companyData = {
      companyName,
      companySector,
      userRole,
      userTeam,

      extractedFromMessage,
      timestamp: new Date().toISOString(),
    }

    console.log('Company info gathered:', JSON.stringify(companyData, null, 2))

    const summary = `Gathered company information: ${[companyName, companySector, userRole, userTeam].filter(Boolean).join(', ')}`
    return `${summary}. Thank you for sharing your company details!`
  },
})
