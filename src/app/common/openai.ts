import { OpenAIApi } from "openai";

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

/**
 * This function calls the OpenAI API and returns the generated text.
 * @param {*} text
 * @param {*} request
 * @param {*} openai
 * @returns
 */
export default async function callGPT(
  text: string,
  request: string,
  openai: OpenAIApi,
) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: generatePrompt(text, request) },
    ],
    temperature: 0.6,
    max_tokens: 1400,
  });

  return completion.data.choices[0].message?.content ?? '';
}
