import { tool } from 'ai'
import { z } from 'zod'

export const ConfirmUsageClaimsTool = tool({
  description: `Use this tool ONLY to confirm AI tool usage based on information from OTHER employees provided in the system contexts.
  
  -Use this tool only if {contexts}is NOT EMPTY

    CRITICAL: Do NOT use this tool if:
  - The current user is mentioning tools for the first time
  - No contexts about other employees exist
  - You're processing the user's own responses
  
  ONLY use this tool when:
  - System contexts contain information about OTHER employees' tool usage
  - You want to confirm if current user also uses tools mentioned by OTHERS
  - Referencing what COWORKERS said about AI tools (from contexts, not current conversation)
  
  📌Example: If system context says "John from Marketing uses MidJourney for content creation"
  Then ask: "Other employees mentioned using MidJourney. Have you heard of such usage?"
  
  ❌ DON'T ask about tools the current user just mentioned
  ✅ DO ask about AI tools mentioned by OTHERS in the provided contexts using {contexts}
  
  📌Keep conversation friendly but professional`,

  parameters: z.object({
    mentionedTools: z
      .array(z.string())
      .describe('AI tools mentioned by other employees'),
    userConfirmation: z
      .string()
      .describe("User's confirmation or denial of using these tools"),
    additionalDetails: z
      .string()
      .optional()
      .describe('Additional details about tool usage'),
    extractedFromMessage: z
      .string()
      .describe('The user message this information was extracted from'),
  }),

  execute: async ({
    mentionedTools,
    userConfirmation,
    additionalDetails,
    extractedFromMessage,
  }) => {
    const confirmationData = {
      mentionedTools,
      userConfirmation,
      additionalDetails,
      extractedFromMessage,
      timestamp: new Date().toISOString(),
    }

    console.log(
      'Usage claims confirmed:',
      JSON.stringify(confirmationData, null, 2),
    )

    const toolsList = mentionedTools.join(', ')
    return `Confirmed usage of ${toolsList}. ${userConfirmation}${additionalDetails ? ` Additional details: ${additionalDetails}` : ''}`
  },
})
