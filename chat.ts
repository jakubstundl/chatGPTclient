#!/usr/bin/env ts-node-script
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
const prompt = require("prompt-sync")();
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import {EOL} from "os"

const apiKey: string = process.env.apikey as string
const aiName: string = "AI";
const myName: string = "Human";
const file: string = "file.txt";

const configuration: Configuration = new Configuration({
  apiKey: apiKey,
});
const openai: OpenAIApi = new OpenAIApi(configuration);
fs.writeFileSync(file, "");

const send = async (message: string) => {
  fs.appendFileSync(file, `${myName}: ${message}\n${aiName}: `);
  const text: string = fs.readFileSync(file, "utf-8");
  const response: any = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${text}`,
    stop: [` ${myName}:`, ` ${aiName}:`],
    temperature: 0.9,
    max_tokens: 3000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
  });
  const answer: string = response.data.choices[0].text.replace(EOL, ""); //.replace(/(\r\n|\n|\r)/gm,"");
  fs.appendFileSync(file, `${answer}\n`);
  console.log(`${aiName}: ${answer}`);
};
(async () => {
  let q: string = "";
  while (q != "bye") {
    q = await prompt(`${myName}: `);
    await send(q);
  }
  fs.writeFileSync(file, "");
})();
