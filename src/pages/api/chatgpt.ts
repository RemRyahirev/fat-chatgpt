import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

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
  const { text, request } = req.body;

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
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
}
