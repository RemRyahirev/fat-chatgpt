export const engineMap = {
  // 'GPT-4 32k': {
  //   model: 'gpt-4-32k',
  //   tokens: 32768,
  // },
  'GPT-4': {
    model: 'gpt-4',
    tokens: 8192,
  },
  'GPT-3.5 Turbo': {
    model: 'gpt-3.5-turbo',
    tokens: 4096,
  },
  'GPT-3': {
    model: 'text-davinci-003',
    tokens: 4097,
  },
} satisfies Record<string, { model: string; tokens: number }>;

export type EngineType = keyof typeof engineMap;

export const ENGINES = Object.keys(engineMap);
export const DEFAULT_ENGINE: EngineType = 'GPT-4';
