import type { NextApiRequest, NextApiResponse } from 'next'
import * as deepl from 'deepl-node';

const translator = new deepl.Translator(process.env.DEEPL_API_KEY ?? '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { text, lang } = req.body;

  const result = await translator.translateText(
    text,
    null,
    lang || 'en-US',
    {
      preserveFormatting: true,
    },
  );

  res.status(200).json({ result });
}
