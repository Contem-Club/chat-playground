import { tool } from 'ai'
import { z } from 'zod'

const AIUseCase = z.object({
  name: z.string().describe('Name or description of the AI use case'),
  problemSolved: z
    .string()
    .describe('Business problem this AI use case solves'),
  tasksAutomated: z
    .array(z.string())
    .describe('Specific tasks automated by AI'),
  impact: z.string().optional().describe('Impact or benefits achieved'),
  roi: z.string().optional().describe('Return on investment or cost savings'),
  department: z
    .string()
    .optional()
    .describe('Department benefiting from this use case'),
})

export const GetImplementedAIUseCasesTool = tool({
  description: `Use this tool to gather information about implemented AI use cases in the company.
  
  Look for mentions of:
  - Specific AI implementations (support automation, expense management, mail drafting)
  - Business problems solved by AI
  - Tasks automated or enhanced by AI
  - Impact, benefits, or ROI from AI implementations
  
  ❌NEVER EVER mention which tool is being used to user.
  ❌NEVER ask more than two questions in a message
  ❌Avoid lengthening questions in a single message using 'and'. 
  ✅ALWAYS Put each sentence on a new line for better readability
  📌Keeping conversation friendly, but professional is essential
  ✅Generally react to user's reply in 10 words, then ask further questions and ❌ Avoid writing messages longer than 50 words
  Example:
  AI: "How has AI been used to automate processes?
  User: "AI has been used to automate many tasks like debugging, drafting mails"
  AI: "Oh! That's interesting. Can you tell me more about how AI is used for debugging?"
  
  `,
  parameters: z.object({
    useCases: z
      .array(AIUseCase)
      .describe('Array of AI use cases implemented in the company'),
    extractedFromMessage: z
      .string()
      .describe('The user message this information was extracted from'),
  }),

  execute: async ({ useCases, extractedFromMessage }) => {
    const useCaseData = {
      useCases,
      extractedFromMessage,
      timestamp: new Date().toISOString(),
    }

    console.log('AI use cases gathered:', JSON.stringify(useCaseData, null, 2))

    const useCaseNames = useCases.map((uc) => uc.name).join(', ')
    return `Gathered information about ${useCases.length} AI use case(s): ${useCaseNames}. Thank you for sharing these implementation details!`
  },
})
