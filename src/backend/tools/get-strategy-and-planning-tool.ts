import { tool } from 'ai'
import { z } from 'zod'

const AIStrategy = z.object({
  planning: z.string().optional().describe('AI planning and roadmap details'),
  performanceMetrics: z
    .array(z.string())
    .optional()
    .describe('Metrics used to measure AI performance'),
  roi: z.string().optional().describe('Return on investment measurements'),
  futureOutlook: z.string().optional().describe('Future AI plans and outlook'),
  challenges: z
    .array(z.string())
    .optional()
    .describe('AI challenges and risks identified'),
  leadershipSupport: z
    .string()
    .optional()
    .describe('Leadership involvement in AI initiatives'),
  incentives: z
    .string()
    .optional()
    .describe('Incentives or support offered for AI adoption'),
})

export const GetStrategyAndPlanningTool = tool({
  description: `Use this tool to gather information about AI strategy, planning, and organizational support.
  
  Look for mentions of:
  - AI planning and roadmap
  - Performance metrics and ROI measurements
  - Future outlook and plans
  - Challenges and risks
  - Leadership support and involvement
  - Incentives for AI adoption
  
  ❌NEVER EVER mention which tool is being used to user.
  ❌NEVER ask more than two questions in a message
  ✅Generally react to user's reply in less than 10 words, then ask further questions and ❌ Avoid writing messages longer than 50 words
  ❌Avoid lengthening questions in a single message using 'and'. 
  ✅ALWAYS Put each sentence on a new line for better readability
  📌Keeping conversation friendly, but professional is essential`,
  parameters: z.object({
    strategy: AIStrategy.describe('AI strategy and planning information'),
    extractedFromMessage: z
      .string()
      .describe('The user message this information was extracted from'),
  }),

  execute: async ({ strategy, extractedFromMessage }) => {
    const strategyData = {
      strategy,
      extractedFromMessage,
      timestamp: new Date().toISOString(),
    }

    console.log(
      'AI strategy and planning gathered:',
      JSON.stringify(strategyData, null, 2),
    )

    const metrics = strategy.performanceMetrics?.join(', ') || 'none specified'
    return `Gathered AI strategy information. Performance metrics mentioned: ${metrics}. Thank you for sharing your strategic insights!`
  },
})
