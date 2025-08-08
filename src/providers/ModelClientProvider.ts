import { IModelClient } from '../contracts/types/ModelClient'
import { Config } from '../config/Config'
import { ClaudeCli } from '../validation/models/ClaudeCli'
import { AnthropicApi } from '../validation/models/AnthropicApi'
import { CerebrasApi } from '../validation/models/CerebrasApi'

export class ModelClientProvider {
  getModelClient(config?: Config): IModelClient {
    const actualConfig = config ?? new Config()

    // Log the model type being used
    if (process.env.TDD_GUARD_DEBUG) {
      process.stderr.write(
        `[TDD Guard] Model type configured: ${actualConfig.modelType}\n`
      )
    }

    if (actualConfig.modelType === 'anthropic_api') {
      return new AnthropicApi(actualConfig)
    }
    if (actualConfig.modelType === 'cerebras') {
      // Check if Cerebras API key is available, fall back to Claude CLI if not
      if (!actualConfig.cerebrasApiKey) {
        if (process.env.TDD_GUARD_DEBUG) {
          process.stderr.write(
            '[TDD Guard] Cerebras API key not found, falling back to Claude CLI\n'
          )
        }
        return new ClaudeCli(actualConfig)
      }
      return new CerebrasApi(actualConfig)
    }
    return new ClaudeCli(actualConfig)
  }
}
