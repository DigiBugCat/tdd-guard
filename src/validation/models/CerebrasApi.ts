import { Cerebras } from '@cerebras/cerebras_cloud_sdk'
import { Config } from '../../config/Config'
import { IModelClient } from '../../contracts/types/ModelClient'

export class CerebrasApi implements IModelClient {
  private readonly config: Config
  private readonly client: Cerebras

  constructor(config?: Config) {
    this.config = config ?? new Config()

    if (!this.config.cerebrasApiKey) {
      throw new Error('CEREBRAS_API_KEY is required for Cerebras model client')
    }

    // Log to stderr to indicate Cerebras is being used (won't interfere with JSON output)
    if (process.env.TDD_GUARD_DEBUG) {
      process.stderr.write(
        '[TDD Guard] Using Cerebras API with qwen-3-coder-480b model\n'
      )
    }

    this.client = new Cerebras({
      apiKey: this.config.cerebrasApiKey,
    })
  }

  async ask(prompt: string): Promise<string> {
    // Define the JSON schema for TDD validation response
    const validationResponseSchema = {
      type: 'object',
      properties: {
        decision: {
          anyOf: [
            { type: 'string', enum: ['block', 'approve'] },
            { type: 'null' },
          ],
          description:
            'The validation decision: block for violations, null for approval or insufficient information',
        },
        reason: {
          type: 'string',
          description: 'Clear explanation with actionable next steps',
        },
      },
      required: ['decision', 'reason'],
      additionalProperties: false,
    }

    // Add instructions to the prompt to ensure JSON response
    const enhancedPrompt = `${prompt}

IMPORTANT: You MUST respond with a valid JSON object matching this exact structure:
{
  "decision": "block" | "approve" | null,
  "reason": "Clear explanation with actionable next steps"
}

Use "block" for TDD violations, null for approval or insufficient information.`

    const response = await this.client.chat.completions.create({
      model: 'qwen-3-coder-480b',
      messages: [
        {
          role: 'user',
          content: enhancedPrompt,
        },
      ],
      temperature: 0.7,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'tdd_validation_response',
          strict: true,
          schema: validationResponseSchema,
        },
      } as Parameters<
        typeof this.client.chat.completions.create
      >[0]['response_format'],
    })

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No choices returned from Cerebras API')
    }

    const message = response.choices[0].message
    if (!message?.content) {
      throw new Error('No content in Cerebras API response')
    }

    return message.content
  }
}
