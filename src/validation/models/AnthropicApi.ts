import Anthropic from '@anthropic-ai/sdk'
import { Config } from '../../config/Config'
import { IModelClient } from '../../contracts/types/ModelClient'

export class AnthropicApi implements IModelClient {
  private readonly config: Config
  private readonly client: Anthropic

  constructor(config?: Config) {
    this.config = config ?? new Config()

    // Log to stderr to indicate Anthropic API is being used (won't interfere with JSON output)
    if (process.env.TDD_GUARD_DEBUG) {
      process.stderr.write(
        '[TDD Guard] Using Anthropic API with claude-sonnet-4 model\n'
      )
    }

    this.client = new Anthropic({
      apiKey: this.config.anthropicApiKey,
    })
  }

  async ask(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    return extractTextFromResponse(response)
  }
}

interface MessageResponse {
  content: Array<{ text?: string; type?: string }>
}

function extractTextFromResponse(response: MessageResponse): string {
  if (response.content.length === 0) {
    throw new Error('No content in response')
  }

  const firstContent = response.content[0]
  if (!('text' in firstContent) || !firstContent.text) {
    throw new Error('Response content does not contain text')
  }

  return firstContent.text
}
