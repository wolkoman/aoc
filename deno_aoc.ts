import {config} from "https://deno.land/x/dotenv/mod.ts";
import {exists as fileExists} from "https://deno.land/std/fs/mod.ts"
import {DOMParser} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

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
            if (isTest) {
                const document = new DOMParser().parseFromString(payload, 'text/html');
                payload = document.querySelectorAll("pre code")[1].innerHTML;
            }
            await Deno.writeTextFile(payloadPath, payload)
            return payload;
        })
}

export async function playDay(day: number, solution: (
    input: string,
    submit: (part: 1 | 2, answer: string, forceReal?: boolean) => void,
    expectTest: (part: 1 | 2, answer: string) => void,
) => Promise<void>) {

    const testPayload = await getPayload(day, undefined, true);
    let testAnswer1: string, testAnswer2: string;

    const submitReal = (submitPart: 1 | 2) => async (part: 1 | 2, answer: string) => {
        if (submitPart === part)
            console.log("Answer to part ", part, " is ", answer);
    }

    const submitTest = async (part: 1 | 2, answerA: string, forceReal?: boolean) => {
        const answer = answerA + "";
        if ((answer === testAnswer1 && part === 1) || (answer === testAnswer2 && part === 2) || forceReal) {
            const realPayload = await getPayload(day);
            await solution(realPayload, submitReal(part), () => {});
        } else {
            console.log({expected: part === 1 ? testAnswer1 : testAnswer2, actual: answer})
        }
    }
    const expectTestAnswer = async (part: 1 | 2, answerA: string) => {
        const answer = answerA + "";
        if (part === 1)
            testAnswer1 = answer;
        else if (part === 2)
            testAnswer2 = answer;
    }
    await solution(testPayload, submitTest, expectTestAnswer);
}