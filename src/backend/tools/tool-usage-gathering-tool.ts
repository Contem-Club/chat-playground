import { tool } from 'ai'
import { z } from 'zod'

// Define tool categories and types
const ToolCategory = z.enum([
  'AI_ASSISTANT',
  'CODE_EDITOR',
  'IDE',
  'DEVELOPMENT_TOOL',
  'DESIGN_TOOL',
  'PRODUCTIVITY_TOOL',
  'COMMUNICATION_TOOL',
  'OTHER',
])

const ToolInfo = z.object({
  name: z
    .string()
    .describe('Name of the tool (e.g., "Cursor", "ChatGPT", "Augment Code")'),
  category: ToolCategory.describe('Category of the tool'),
  usage: z.string().describe('How the user uses this tool'),
  frequency: z.string().describe('How often the user uses this tool'),
  satisfaction: z.string().describe('User satisfaction with the tool'),
  context: z
    .string()
    .describe('Additional context about the tool usage mentioned by the user'),
})

export const ToolUsageGatheringTool = tool({
  description: `Use this tool to gather and store information about tools that the user mentions using.
  
  Look for mentions of:
  - AI assistants: ChatGPT, Claude, Gemini, Copilot, etc.
  - Code editors: Cursor, VS Code, Vim, Emacs, etc.
  - IDEs: IntelliJ, Eclipse, Xcode, etc.
  - Development tools: Augment Code, GitHub, GitLab, Docker, etc.
  
   - Following up on tool usage patterns
  
  Extract information about:
  - What tools they use specific to job role and vertical
  - How they use them
  - How often they use them ( ie all the time or rarely or never)
  - Their satisfaction level

  
  ❌NEVER EVER mention which tool is being used to user.
  ❌NEVER ask more than two questions in a message
  ✅Generally react to user's reply in 10 words, then ask further questions and ❌ Avoid writing messages longer than 50 words
 
  Example:
  User: "I am a Developer. In payments vertical."
  AI: "Oh, Developer. What tools do you use for development?"
 
  `,
  parameters: z.object({
    tools: z.array(ToolInfo).describe('Array of tools mentioned by the user'),
    extractedFromMessage: z
      .string()
      .describe('The user message this information was extracted from'),
  }),

  execute: async ({ tools, extractedFromMessage }) => {
    // Store the tool usage information (in a real app, this would go to a database)
    const toolUsageData = {
      tools,
      extractedFromMessage,
      timestamp: new Date().toISOString(),
      sessionId: 'current-session', // In a real app, this would be a proper session ID
    }

    // Store to database
    console.info(tool)

    console.log(
      'Tool usage data gathered:',
      JSON.stringify(toolUsageData, null, 2),
    )

    // Create a summary of what was gathered
    const toolNames = tools.map((t) => t.name).join(', ')
    const summary = `Gathered information about ${tools.length} tool(s): ${toolNames}`

    // Return a response that acknowledges the information gathering
    return `${summary}. Thank you for sharing your tool usage! This helps us understand how developers work with different tools.`
  },
})
