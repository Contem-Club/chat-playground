/* eslint-disable @typescript-eslint/no-unused-vars */
import { tool } from 'ai'
import {
  ConversationCompletionTool,
  GetCompanyInfoTool,
  ToolUsageGatheringTool,
} from '../tools'

export interface PromptCreationRequest {
  contexts: string[]
  template: string
}

export interface IPromptService {
  createPrompt(context: string): string
  createPromptFromTemplate(request: PromptCreationRequest): string
}

export class PromptService implements IPromptService {
  private readonly systemPromptWithContext: string
  private readonly systemPromptWithoutContext: string
  private readonly defaultPrompt: string
  private readonly defaultPromptWithContext: string
  //private readonly newPromt: string

  constructor() {
    //this. = ``;
    this.systemPromptWithContext = `You are a helpful AI assistant. Use the following context to provide accurate and relevant responses.


Please respond to user queries based on the provided context. If the context doesn't contain relevant information, acknowledge this and provide a general helpful response.`

    this.defaultPrompt = `
🧠 YOU ARE: An AI Readiness Assessor.Your core mission is to comprehensively benchmark a company's AI adoption
 and integration by extracting detailed information across all relevant aspects of their AI landscape.

🎯 MISSION: Benchmark a company's AI adoption and integration

You're the central brain and have access to specialized tools for gathering information.
Use your discretion to select the most appropriate tool based on user responses to maximize information extraction.
Each tool is designed to capture specific aspects of AI readiness. Make sure you use the tools ALWAYS to extract info.


⚙️ TOOL SEQUENCE:
GetCompanyInfoTool → ToolUsageGatheringTool → others


- Use ONLY ONE tool per response
-Don't let questions in message be longer than 40 words.
-Try sticking to topic and following up till you get some info on it
✅ Continue asking questions with your own discretion to maximise info.

🔄 GREETING HANDLING:
When user sends introductory messages like "Hi", "Hello", "Hey", or similar greetings, 
ALWAYS use GetCompanyInfoTool to start gathering company information while responding warmly.

✅ESSENTIAL to ask user about company details first!

✅ALWAYS be inviting, inquisitive, friendly, but professional.


`

    this.defaultPromptWithContext =
      this.defaultPrompt +
      `
Use the following contexts about OTHER employees when using GetUnitsDepartmentsUsingAITool:
{contexts}


`

    this.systemPromptWithoutContext = this.defaultPrompt
  }

  createPrompt(context: string): string {
    const trimmedContext = context.trim()

    if (trimmedContext === '') {
      return this.systemPromptWithoutContext
    }

    return this.systemPromptWithContext.replace('{CONTEXT}', trimmedContext)
  }

  createPromptFromTemplate(request: PromptCreationRequest): string {
    const { contexts, template } = request

    if (!template.trim()) {
      // Default template if none provided
      if (contexts.length > 0) {
        const contextText = contexts
          .filter((ctx) => ctx.trim())
          .map((ctx, index) => `Context ${index + 1}: ${ctx.trim()}`)
          .join('\n\n')

        return this.defaultPromptWithContext.replace(
          /\{contexts\}/g,
          contextText,
        )
      } else {
        return this.defaultPrompt
      }
    }

    // Process template with placeholders
    let processedTemplate = template

    // Replace {contexts} with all contexts joined
    const filteredContexts = contexts.filter((ctx) => ctx.trim())
    const allContexts = filteredContexts
      .map((ctx, index) => `Context ${index + 1}: ${ctx.trim()}`)
      .join('\n\n')
    processedTemplate = processedTemplate.replace(/\{contexts\}/g, allContexts)

    // Replace individual context placeholders {context1}, {context2}, etc.
    filteredContexts.forEach((context, index) => {
      const placeholder = `{context${index + 1}}`
      processedTemplate = processedTemplate.replace(
        new RegExp(placeholder, 'g'),
        context.trim(),
      )
    })

    return processedTemplate
  }
}
