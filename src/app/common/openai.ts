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
 * @param {string} text
 * @param {string} request
 * @param {string} engine
 * @returns
 */
export default async function callGPT(
  text: string,
  request: string,
  engine: string,
) {
  const res = await fetch('/api/chatgpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      request,
      engine,
    }),
  });

  const result: {
    success: boolean;
    result: {
      text: string;
      details?: Record<string, unknown>;
    };
  } = await res.json();

  return result.success ? result.result.text : null;
}
