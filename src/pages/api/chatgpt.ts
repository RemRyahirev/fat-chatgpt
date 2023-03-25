import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { engineMap } from '@/app/common/constants';

const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * This function generates the prompt for the OpenAI API.
 * @param {*} text
 * @param {*} request
 * @returns
 */
function generatePrompt(
  text: string,
  request: string,
) {
  return `${request}:
    
    \`\`\`
    ${text}
    \`\`\`
    `;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { text, request, engine } = req.body as { text: string, request: string, engine: keyof typeof engineMap };

  const model = engineMap[engine] || 'gpt-3.5-turbo';

  try {
    if (model === 'text-davinci-003') {
      const completion = await openai.createCompletion({
        model: engineMap[engine] || 'gpt-3.5-turbo',
        prompt: generatePrompt(text, request),
        temperature: 0.6,
        max_tokens: 1400,
      });

      const result = {
        text: completion.data.choices[0].text ?? '',
      };

      res.status(200).json({ result });
      return;
    }

    const completion = await openai.createChatCompletion({
      model: engineMap[engine] || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: generatePrompt(text, request) },
      ],
      temperature: 0.6,
      max_tokens: 1400,
    });

    const result = {
      text: completion.data.choices[0].message?.content ?? '',
    };

    res.status(200).json({ result });
  } catch (err) {
    res.status(200).json({ result: { text: `<Error: ${(err as Error).message}>` } })
  }
}
