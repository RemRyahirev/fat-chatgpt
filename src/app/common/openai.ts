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
) {
  const res = await fetch('/api/chatgpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      request,
    }),
  });

  const result: {
    result: {
      text: string;
    };
  } = await res.json();

  return result.result.text;
}
