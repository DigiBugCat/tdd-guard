import { describe, test, expect, vi, beforeEach } from 'vitest'
import { CerebrasApi } from './CerebrasApi'
import { Config } from '../../config/Config'
import { Cerebras } from '@cerebras/cerebras_cloud_sdk'

// Mock the Cerebras SDK
vi.mock('@cerebras/cerebras_cloud_sdk')

// Test constants
const DEFAULT_TEST_PROMPT = 'test prompt'
const DEFAULT_API_KEY = 'test-cerebras-key'

describe('CerebrasApi', () => {
  let sut: Awaited<ReturnType<typeof createSut>>
  let client: CerebrasApi

  beforeEach(() => {
    sut = createSut()
    client = sut.client
  })

  test('should implement IModelClient interface', () => {
    expect(client.ask).toBeDefined()
  })

  test('should accept optional Config in constructor', () => {
    const config = new Config({ cerebrasApiKey: DEFAULT_API_KEY })
    const apiClient = new CerebrasApi(config)
    expect(apiClient).toBeDefined()
  })

  test('should throw error if API key is not provided', () => {
    // Temporarily clear environment variables to test the error case
    const originalCerebrasKey = process.env.CEREBRAS_API_KEY
    const originalTddGuardCerebrasKey = process.env.TDD_GUARD_CEREBRAS_API_KEY
    delete process.env.CEREBRAS_API_KEY
    delete process.env.TDD_GUARD_CEREBRAS_API_KEY

    const config = new Config({ cerebrasApiKey: undefined })
    expect(() => new CerebrasApi(config)).toThrow(
      'CEREBRAS_API_KEY is required for Cerebras model client'
    )

    // Restore environment variables
    if (originalCerebrasKey) process.env.CEREBRAS_API_KEY = originalCerebrasKey
    if (originalTddGuardCerebrasKey)
      process.env.TDD_GUARD_CEREBRAS_API_KEY = originalTddGuardCerebrasKey
  })

  test('creates Cerebras client with API key from config', () => {
    const apiKey = 'test-api-key-123'
    const localSut = createSut(apiKey)

    expect(localSut.wasCreatedWithApiKey(apiKey)).toBe(true)
  })

  test('uses qwen-3-coder-480b model', async () => {
    await client.ask(DEFAULT_TEST_PROMPT)
    const call = sut.getLastCreateCall()
    expect(call.model).toBe('qwen-3-coder-480b')
  })

  test('does not set max tokens limit', async () => {
    await client.ask(DEFAULT_TEST_PROMPT)
    const call = sut.getLastCreateCall()
    expect(call.max_tokens).toBeUndefined()
  })

  test('sets temperature to 0.7 for varied but structured responses', async () => {
    await client.ask(DEFAULT_TEST_PROMPT)
    const call = sut.getLastCreateCall()
    expect(call.temperature).toBe(0.7)
  })

  test('passes enhanced prompt with JSON instructions as user message', async () => {
    const prompt = 'Does this follow TDD?'
    await client.ask(prompt)
    const call = sut.getLastCreateCall()
    expect(call.messages[0].role).toBe('user')
    expect(call.messages[0].content).toContain(prompt)
    expect(call.messages[0].content).toContain(
      'IMPORTANT: You MUST respond with a valid JSON object'
    )
  })

  test('configures response_format for structured JSON output', async () => {
    await client.ask(DEFAULT_TEST_PROMPT)
    const call = sut.getLastCreateCall()
    expect(call.response_format).toBeDefined()
    expect(call.response_format.type).toBe('json_schema')
    expect(call.response_format.json_schema.name).toBe(
      'tdd_validation_response'
    )
    expect(call.response_format.json_schema.strict).toBe(true)
    expect(call.response_format.json_schema.schema).toMatchObject({
      type: 'object',
      required: ['decision', 'reason'],
      additionalProperties: false,
    })
  })

  test('ask method should return text from response', async () => {
    const expectedText = 'Model response text'
    sut.mockSuccessResponse(expectedText)
    const result = await client.ask(DEFAULT_TEST_PROMPT)
    expect(result).toBe(expectedText)
  })

  test('ask method should throw error when no choices returned', async () => {
    sut.mockCreate.mockResolvedValue({ choices: [] })
    await expect(client.ask(DEFAULT_TEST_PROMPT)).rejects.toThrow(
      'No choices returned from Cerebras API'
    )
  })

  test('ask method should handle missing message content', async () => {
    sut.mockCreate.mockResolvedValue({
      choices: [{ message: {} }],
    })
    await expect(client.ask(DEFAULT_TEST_PROMPT)).rejects.toThrow(
      'No content in Cerebras API response'
    )
  })

  test('ask method should handle API errors', async () => {
    sut.mockCreate.mockRejectedValue(new Error('API error'))
    await expect(client.ask(DEFAULT_TEST_PROMPT)).rejects.toThrow('API error')
  })
})

// Test Helpers
interface CreateCall {
  model: string
  max_tokens?: number
  temperature: number
  messages: Array<{ role: string; content: string }>
  response_format: {
    type: string
    json_schema: {
      name: string
      strict: boolean
      schema: unknown
    }
  }
}

function createSut(apiKey: string = DEFAULT_API_KEY) {
  vi.clearAllMocks()

  const mockCreate = vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: 'Model response',
        },
      },
    ],
  })

  const mockCerebrasConstructor = vi.mocked(Cerebras)
  mockCerebrasConstructor.mockImplementation(
    () =>
      ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }) as unknown as Cerebras
  )

  const config = new Config({ cerebrasApiKey: apiKey })
  const client = new CerebrasApi(config)

  const getLastCreateCall = (): CreateCall => {
    const lastCall = mockCreate.mock.calls[mockCreate.mock.calls.length - 1]
    return lastCall[0]
  }

  const mockSuccessResponse = (content: string): void => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content,
          },
        },
      ],
    })
  }

  const wasCreatedWithApiKey = (key: string): boolean => {
    return mockCerebrasConstructor.mock.calls.some(
      (call) => call[0]?.apiKey === key
    )
  }

  return {
    client,
    mockCreate,
    mockCerebrasConstructor,
    config,
    getLastCreateCall,
    mockSuccessResponse,
    wasCreatedWithApiKey,
  }
}
