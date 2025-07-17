import { streamText, type CoreMessage } from 'ai'
import { createGoogleAI } from '../config/ai-config.js'
import {
  ConversationCompletionTool,
  ToolUsageGatheringTool,
  GetCompanyInfoTool,
  ConfirmUsageClaimsTool,
  GetImplementedAIUseCasesTool,
  GetUnitsDepartmentsUsingAITool,
  GetDataAwarenessTool,
  GetStrategyAndPlanningTool,
} from '../tools/index.js'

export interface IAIChatService {
  generateStreamingResponse(
    messages: CoreMessage[],
    systemPrompt: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>
}

export class AIChatService implements IAIChatService {
  private googleAI

  constructor() {
    this.googleAI = createGoogleAI()
  }

  async generateStreamingResponse(
    messages: CoreMessage[],
    systemPrompt: string,
  ) {
    try {
      // Force tool usage by adding a parameter
      const result = streamText({
        model: this.googleAI.model,
        system: systemPrompt,
        messages,
        tools: {
          conversationCompletion: ConversationCompletionTool,
          toolUsageGathering: ToolUsageGatheringTool, // Put first
          getCompanyInfo: GetCompanyInfoTool,
          confirmUsageClaims: ConfirmUsageClaimsTool,
          getImplementedAIUseCases: GetImplementedAIUseCasesTool,
          getUnitsDepartmentsUsingAI: GetUnitsDepartmentsUsingAITool,
          getDataAwareness: GetDataAwarenessTool,
          getStrategyAndPlanning: GetStrategyAndPlanningTool,
        },
        maxSteps: this.googleAI.config.maxSteps,
        // Add tool_choice to force tool usage
        toolChoice: 'auto', //auto for ai to decide, required for compulsory tool usage
      })

      return result
    } catch (error: unknown) {
      console.error('Error generating streaming response:', error)
      throw new Error('Failed to generate streaming response')
    }
  }
}
