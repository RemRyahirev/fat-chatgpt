export const engineMap = {
  // 'ChatGPT-4 32k': {
  //   model: 'gpt-4-32k',
  //   tokens: 32768,
  // },
  'ChatGPT-4': {
    model: 'gpt-4',
    tokens: 8192,
  },
  'ChatGPT-3.5 Turbo': {
    model: 'gpt-3.5-turbo',
    tokens: 4096,
  },
  'ChatGPT-3': {
    model: 'text-davinci-003',
    tokens: 4097,
  },
} satisfies Record<string, { model: string; tokens: number }>;

export type EngineType = keyof typeof engineMap;

export const ENGINES = Object.keys(engineMap);
export const DEFAULT_ENGINE: EngineType = 'ChatGPT-4';
