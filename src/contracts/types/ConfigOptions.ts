export type ConfigOptions = {
  mode?: 'production' | 'test'
  projectRoot?: string
  useSystemClaude?: boolean
  anthropicApiKey?: string
  cerebrasApiKey?: string
  modelType?: string
  linterType?: string
}
