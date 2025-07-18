import { streamText, type CoreMessage } from 'ai'
import { createGoogleAI } from '../config/ai-config.js'
import {
  ConversationCompletionTool,
  ToolUsageGatheringTool,
  GetCompanyInfoTool,
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
      console.log('Starting streaming response generation...')

      const result = streamText({
        model: this.googleAI.model,
        system: systemPrompt,
        messages,
        tools: {
          conversationCompletion: ConversationCompletionTool,
          toolUsageGathering: ToolUsageGatheringTool,
          getCompanyInfo: GetCompanyInfoTool,
          getImplementedAIUseCases: GetImplementedAIUseCasesTool,
          getUnitsDepartmentsUsingAI: GetUnitsDepartmentsUsingAITool,
          getDataAwareness: GetDataAwarenessTool,
          getStrategyAndPlanning: GetStrategyAndPlanningTool,
        },
        maxSteps: this.googleAI.config.maxSteps,
        toolChoice: 'auto',
      })

      console.log('Stream created successfully', result)
      return result
    } catch (error: unknown) {
      console.error('CRITICAL ERROR in generateStreamingResponse:', error)
      throw new Error('Failed to generate streaming response')
    }
  }
}
