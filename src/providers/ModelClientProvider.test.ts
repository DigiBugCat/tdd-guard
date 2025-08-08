import { describe, test, expect } from 'vitest'
import { ModelClientProvider } from './ModelClientProvider'
import { Config } from '../config/Config'
import { ClaudeCli } from '../validation/models/ClaudeCli'
import { AnthropicApi } from '../validation/models/AnthropicApi'
import { CerebrasApi } from '../validation/models/CerebrasApi'

describe('ModelClientProvider', () => {
  test('returns ClaudeCli when config modelType is claude_cli', () => {
    const config = new Config({ modelType: 'claude_cli' })

    const provider = new ModelClientProvider()
    const client = provider.getModelClient(config)

    expect(client).toBeInstanceOf(ClaudeCli)
  })

  test('returns AnthropicApi when config modelType is anthropic_api', () => {
    const config = new Config({ modelType: 'anthropic_api' })

    const provider = new ModelClientProvider()
    const client = provider.getModelClient(config)

    expect(client).toBeInstanceOf(AnthropicApi)
  })

  test('uses default config when no config is provided', () => {
    // Clear environment variables to test fallback
    const originalCerebrasKey = process.env.CEREBRAS_API_KEY
    const originalTddGuardCerebrasKey = process.env.TDD_GUARD_CEREBRAS_API_KEY
    delete process.env.CEREBRAS_API_KEY
    delete process.env.TDD_GUARD_CEREBRAS_API_KEY

    const provider = new ModelClientProvider()
    const client = provider.getModelClient()

    // Without Cerebras API key, falls back to ClaudeCli even though default is 'cerebras'
    expect(client).toBeInstanceOf(ClaudeCli)

    // Restore environment variables
    if (originalCerebrasKey) process.env.CEREBRAS_API_KEY = originalCerebrasKey
    if (originalTddGuardCerebrasKey)
      process.env.TDD_GUARD_CEREBRAS_API_KEY = originalTddGuardCerebrasKey
  })

  test('passes config with API key to AnthropicApi client', () => {
    const config = new Config({
      modelType: 'anthropic_api',
      anthropicApiKey: 'test-api-key-123',
    })

    const provider = new ModelClientProvider()
    const client = provider.getModelClient(config)

    expect(client).toBeInstanceOf(AnthropicApi)
    expect((client as AnthropicApi).config.anthropicApiKey).toBe(
      'test-api-key-123'
    )
  })

  test('passes config with useSystemClaude to ClaudeCli client', () => {
    const config = new Config({
      modelType: 'claude_cli',
      useSystemClaude: true,
    })

    const provider = new ModelClientProvider()
    const client = provider.getModelClient(config)

    expect(client).toBeInstanceOf(ClaudeCli)
    expect((client as ClaudeCli).config.useSystemClaude).toBe(true)
  })

  test('returns CerebrasApi when config modelType is cerebras', () => {
    const config = new Config({
      modelType: 'cerebras',
      cerebrasApiKey: 'test-cerebras-key',
    })

    const provider = new ModelClientProvider()
    const client = provider.getModelClient(config)

    expect(client).toBeInstanceOf(CerebrasApi)
  })

  test('passes config with API key to CerebrasApi client', () => {
    const config = new Config({
      modelType: 'cerebras',
      cerebrasApiKey: 'test-cerebras-key-123',
    })

    const provider = new ModelClientProvider()
    const client = provider.getModelClient(config)

    expect(client).toBeInstanceOf(CerebrasApi)
    expect((client as CerebrasApi).config.cerebrasApiKey).toBe(
      'test-cerebras-key-123'
    )
  })

  test('falls back to ClaudeCli when cerebras is set but API key is missing', () => {
    // Clear environment variables to test fallback
    const originalCerebrasKey = process.env.CEREBRAS_API_KEY
    const originalTddGuardCerebrasKey = process.env.TDD_GUARD_CEREBRAS_API_KEY
    delete process.env.CEREBRAS_API_KEY
    delete process.env.TDD_GUARD_CEREBRAS_API_KEY

    const config = new Config({
      modelType: 'cerebras',
      cerebrasApiKey: undefined,
    })

    const provider = new ModelClientProvider()
    const client = provider.getModelClient(config)

    expect(client).toBeInstanceOf(ClaudeCli)

    // Restore environment variables
    if (originalCerebrasKey) process.env.CEREBRAS_API_KEY = originalCerebrasKey
    if (originalTddGuardCerebrasKey)
      process.env.TDD_GUARD_CEREBRAS_API_KEY = originalTddGuardCerebrasKey
  })
})
