import { config } from "https://deno.land/x/dotenv/mod.ts";
import { exists as fileExists } from "https://deno.land/std/fs/mod.ts"
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export async function getPayload(day: number, year = 2022, testOffset?: number) {
    const isTest = testOffset !== undefined;
    const payloadPath = `./${year}/payload/day${String(day).padStart(2, '0')}${isTest ? (`.test${testOffset}`) : ''}.payload.txt`;
    const exists = await fileExists(payloadPath);
    if (exists)
        return await Deno.readTextFile(payloadPath);

    console.log("Fetching payload");
    return await fetch(`https://adventofcode.com/${year}/day/${day}${isTest ? '' : '/input'}`, {
        headers: {
            cookie: `session=${config().COOKIE}`
        }
    }).then(response => response.text())
        .then(async data => {
            let payload = data;
            if (isTest) {
                const document = new DOMParser().parseFromString(payload, 'text/html');
                payload = document.querySelectorAll("pre code")[testOffset].innerText;
            }
            await Deno.writeTextFile(payloadPath, payload)
            return payload;
        })
}

type Solution = (
    input: string,
    submit: (part: 1 | 2, answer: any, forceReal?: boolean) => void,
    expectTest: (part: 1 | 2, answer: any) => void
) => Promise<void>;

type TestInput = {
    testInput1: number;
    testInput2: number;
};

export async function playDay(day: number, solutionOrExampleOffset: Solution | number | TestInput, extraSolution?: Solution) {

    const solution = extraSolution ?? solutionOrExampleOffset as Solution;
    const offset = extraSolution ? solutionOrExampleOffset as number | TestInput : 0;
    const testInput = {testInput1: 0, testInput2: 0};
    if(((x: number | TestInput): x is number => Number.isInteger(x))(offset)){
        testInput.testInput1 = offset;
        testInput.testInput2 = offset;
    }else{
        testInput.testInput1 = offset.testInput1;
        testInput.testInput2 = offset.testInput2;
    }
    let testAnswer1: string, testAnswer2: string;

    const submitReal = (submitPart: 1 | 2) => async (part: 1 | 2, answer: string) => {
        if (submitPart === part)
            console.log(`Answer to part ${part}:`, answer);
    }

    const submitTest = async (part: 1 | 2, answerA: any, forceReal?: boolean) => {
        const answer = answerA + "";
        if ((answer === testAnswer1 && part === 1) || (answer === testAnswer2 && part === 2) || forceReal) {
            const realPayload = await getPayload(day);
            await solution(realPayload, submitReal(part), () => { });
        } else {
            console.log({ expected: part === 1 ? testAnswer1 : testAnswer2, actual: answer })
        }
    }
    const expectTestAnswer = async (part: 1 | 2, answerA: any) => {
        const answer = answerA + "";
        if (part === 1)
            testAnswer1 = answer;
        else if (part === 2)
            testAnswer2 = answer;
    }
    const testPayload1 = await getPayload(day, undefined, testInput.testInput1);
    await solution(testPayload1, submitTest, expectTestAnswer);
}