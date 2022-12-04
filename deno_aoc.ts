import {config} from "https://deno.land/x/dotenv/mod.ts";
import {exists as fileExists} from "https://deno.land/std/fs/mod.ts"
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export async function getPayload(day: number, year = 2022, isTest?: boolean) {
    const payloadPath = `./${year}/day${String(day).padStart(2, '0')}${isTest ? '.test' : ''}.payload.txt`;
    const exists = await fileExists(payloadPath);
    if (exists && false)
        return await Deno.readTextFile(payloadPath);

    return await fetch(`https://adventofcode.com/${year}/day/${day}${isTest ? '' : '/input'}`, {
        headers: {
            cookie: `session=${config().COOKIE}`
        }
    }).then(response => response.text())
        .then(async data => {
            let payload = data;
            if(isTest){
                const document = new DOMParser().parseFromString(payload, 'text/html');
                payload = document.querySelector("pre code").innerHTML;
            }
            await Deno.writeTextFile(payloadPath, payload)
            return payload;
        })
}

export async function playDay(day: number, solution: (
    input: string,
    submit: (part: 1|2, answer: string) => void,
    expectTes: (part: 1|2, answer: string) => void,
) => Promise<string>) {
    const testPayload = await getPayload(day, undefined, true);
    let testAnswer;
    const submit = (answer1: string, answer2?: string) => {
        if(answer1 === testAnswer){
            const realPayload = await getPayload(day, undefined, true);
            const realAnswer = await solution(testPayload, expectTestAnswer, submit);

        }else{
            console.log({expected: testAnswer, actual: answer1})
        }
    }
    const expectTestAnswer = (answer: string) => {
        testAnswer = answer;
    }
    const answer = await solution(testPayload, expectTestAnswer, submit);
    console.log({payload: testPayload, answer})
}