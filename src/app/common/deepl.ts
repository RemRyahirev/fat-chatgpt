export default async function translate(
  text: string,
  lang?: string,
) {
  const res = await fetch('/api/deepl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      lang,
    }),
  });

  const result: {
    result: {
      text: string;
      detectedSourceLang: string;
    };
  } = await res.json();

  return {
    text: result.result.text,
    lang: result.result.detectedSourceLang,
  };
}
