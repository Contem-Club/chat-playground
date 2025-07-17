/* eslint-disable @typescript-eslint/no-unused-vars */
import { tool } from 'ai'
import { z } from 'zod'

const DataSecurity = z.object({
  restrictedAccess: z
    .boolean()
    .optional()
    .describe('Whether data has restricted access controls'),
  encryption: z.boolean().optional().describe('Whether data is encrypted'),
  anonymization: z.boolean().optional().describe('Whether data is anonymized'),
  activityTracking: z
    .boolean()
    .optional()
    .describe('Whether data access is tracked'),
  legalCompliance: z
    .boolean()
    .optional()
    .describe('Whether data handling is legally compliant'),
  backupRecovery: z
    .boolean()
    .optional()
    .describe('Whether backup and recovery plans exist'),
})

export const GetDataAwarenessTool = tool({
  description: `Use this tool to gather information about data readiness, organization, and security practices.
  
  Look for mentions of:
  - Data organization and structure
  - Data security measures (access controls, encryption, anonymization)
  - Activity tracking and monitoring
  - Legal compliance and governance
  - Backup and recovery procedures
  
  ❌NEVER EVER mention which tool is being used to user.
  ❌NEVER ask more than two questions in a message

  ❌Avoid lengthening questions in a single message using 'and'. 
  ✅ALWAYS Put each sentence on a new line for better readability
  📌Keeping conversation friendly, but professional is essential
   ✅Generally react to user's reply in 10 words, then ask further questions and ❌ Avoid writing messages longer than 50 words
  Example:
  User (answering to etUnitsDepartmentsUsingAITool): "Almost all. HR uses Gemini, while Product team uses claude"
  AI: "If AI implementation is so widespread, data awareness must be a point you have considered. How do you ensure data security?"
  `,
  parameters: z.object({
    dataOrganization: z
      .string()
      .optional()
      .describe('How data is organized and structured'),
    dataSecurity: DataSecurity.describe('Data security measures in place'),
    dataGovernance: z
      .string()
      .optional()
      .describe('Data governance policies and procedures'),
    challenges: z
      .string()
      .optional()
      .describe('Data-related challenges or concerns'),
    extractedFromMessage: z
      .string()
      .describe('The user message this information was extracted from'),
  }),

  execute: async ({
    dataOrganization,
    dataSecurity,
    dataGovernance,
    challenges,
    extractedFromMessage,
  }) => {
    const dataAwarenessData = {
      dataOrganization,
      dataSecurity,
      dataGovernance,
      challenges,
      extractedFromMessage,
      timestamp: new Date().toISOString(),
    }

    console.log(
      'Data awareness gathered:',
      JSON.stringify(dataAwarenessData, null, 2),
    )

    const securityFeatures = Object.entries(dataSecurity)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key)
      .join(', ')

    return `Gathered data awareness information. Security measures mentioned: ${securityFeatures || 'none specified'}. Thank you for sharing your data practices!`
  },
})
