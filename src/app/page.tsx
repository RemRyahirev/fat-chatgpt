'use client';

import { splitStringAtParagraph } from "@/app/common/chunk.helper";
import callGPT from "@/app/common/openai";
import translate from '@/app/common/deepl';
import { DEFAULT_ENGINE, engineMap, ENGINES, EngineType } from '@/app/common/constants';
import styles from "@/app/styles/Home.module.css";
import Head from "next/head";
import { FormEvent, useEffect, useState } from 'react';
import sequence from "./common/sequence";
import Typewriter from "./components/TypeWriter";

export default function Home() {
  const [requestInput, setRequestInput] = useState("Summarize the text below");
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState([] as string[]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chunks, setChunks] = useState([] as string[]);
  const [useTranslate, setUseTranslate] = useState(false);
  const [engine, setEngine] = useState(DEFAULT_ENGINE);
  let lang = '';

  const chunksSize = engineMap[engine || DEFAULT_ENGINE].tokens - 1000;

  // This useEffect will run once when the component mounts
  // It checks if the window and local storage exist, and if so, it
  // checks if there is an API request stored in local storage, and if so, it
  // sets the requestInput state to the value of the request.
  useEffect(() => {
    if (window && window.localStorage) {
      const request = window.localStorage.getItem("request");
      if (request) {
        setRequestInput(request);
      }
    }
  }, []);

  useEffect(() => {
    let chunks = splitStringAtParagraph(textInput, chunksSize);
    setChunks(chunks);
  }, [textInput, chunksSize]);

  /**
   * This function calls the API server, which then calls the OpenAI API.
   * The OpenAI API uses the text sent as input and the request to generate a new text.
   * The API server then returns the generated text to this function.
   * The function return the generated text.
   * @param {*} chunk
   * @param {*} openaiAPIKey
   * @param {*} requestInput
   * @returns
   */
  async function processChunk(
    chunk: string,
    requestInput: string,
  ) {
    return callGPT(chunk, requestInput, engine);
  }

  function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  /**
   * This function is called when the user clicks the submit button.
   * It calls the processChunk function in sequence for each chunk of the text.
   * It then sets the result state to the generated text.
   * @param {*} event
   */
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {

      setProcessing(true);

      setResult([]);

      let textChunks = chunks.slice();
      if (useTranslate) {
        const translated = await translate(textInput);
        textChunks = splitStringAtParagraph(translated.text, chunksSize);
        lang = translated.lang === 'en' ? '' : translated.lang;
        await new Promise(resolve => setTimeout(resolve, 0));
      } else {
        lang = '';
      }

      await sequence(textChunks, (chunk, index) => {
        scrollToBottom();
        setProgress(Math.round(((index - 1) / chunks.length) * 100));
        console.log(`Processing chunk: ${index} of ${chunks.length}`);

        return processChunk(chunk, requestInput)
          .then(async (resRaw) => {
            if (resRaw === null) {
              throw new Error('Error in ChatGPT call');
            }

            let res = resRaw;
            if (useTranslate && lang) {
              const translated = await translate(res, lang);
              res = translated.text;
            }

            setResult((prevResult) => [...prevResult, res]);
            return res;
          })
          .finally(() => {
            return result;
          });
      });
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert((error as Error).message);
    } finally {
      setProcessing(false);
    }
  }

  /**
   * This function is called when the user enters a new request.
   * It sets the requestInput state to the new request.
   * It also stores the request in the local storage.
   * @param {*} request
   */
  const setRequestAndPersist = (request: string) => {
    setRequestInput(request);
    if (window && window.localStorage) {
      window.localStorage.setItem("request", request);
    }
  };

  const setTextAndChunks = (text: string) => {
    setTextInput(text);
  };

  return (
    <div>
      <Head>
        <title>FatGPT</title>
        <link rel="icon" href="/ai.png" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={onSubmit}>
          <label>Model</label>
          <select
            defaultValue={engine}
            onChange={(e) => setEngine(e.target.value as EngineType)}
          >
            {ENGINES.map(eng => (
              <option key={eng} value={eng}>{eng}</option>
            ))}
          </select>

          <label>
            Use Deepl to translate&nbsp;
            <input
              type="checkbox"
              checked={useTranslate}
              onChange={(e) => setUseTranslate(e.target.checked)}
            />
          </label>
          <br />

          <label>Enter your request</label>
          <textarea
            name="request"
            rows={2}
            placeholder="Enter your request"
            value={requestInput}
            onChange={(e) => setRequestAndPersist(e.target.value)}
          />
          <label>The text you want to process</label>
          <textarea
            name="text"
            rows={10}
            placeholder={`Enter your text here, there is no size limitation, the content will be split into ${chunksSize} characters chunks. Each chunk will be processed separatly by openAI.`}
            value={textInput}
            onChange={(e) => setTextAndChunks(e.target.value)}
          />
          {!!textInput?.length ? (<div className={styles.size}>{`${textInput.length} characters - ${Math.floor(textInput.length / chunksSize) + 1} chunks to process`}</div>) : null}
          {!processing ? <input type="submit" value="Process your request" /> : null}
          {processing ? (
            <input
              type="submit"
              value="Processing wait a few seconds..."
              disabled
            />
          ) : null}
          {processing ? <progress value={progress} max="100" /> : null}
        </form>
        {result ? (
          <div className={styles.resultContainer}>
            {result.map((item, index) => {

              return <>
                <Typewriter key={`result-${index}`} text={item} />
                {chunks.length > 1 ? (<div className={styles.partLabel} key={`result-title-${index}`}>Part {index + 1}</div>) : null}
              </>
            })}
          </div>
        ) : null}
      </main>
    </div>
  );
}
