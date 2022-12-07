import {playDay} from "../deno_aoc.ts";

playDay(5, async (input, submit, expectTest) => {

    const stackArray = input
        .split("\n\n")[0]
        .split("\n")
        .filter(line => !line.startsWith(" 1"));
    const startStacks = Array.from({length: (stackArray[0].length+1)/4})
        .map((x,stack) => Array.from({length: stackArray.length})
            .map((x,position) => stackArray[position][1+stack*4])
            .filter(char => char !== " ")
            .reverse()
        )
    const instructions = input.split("\n\n")[1].split("\n")
        .filter(x => x.startsWith("move"))
        .map(line => line.split(" "))
        .map(line => [line[1], line[3], line[5]]);

    await expectTest(1, "CMZ");
    const newStack = instructions
        .reduce((stack, instruction) => {
            Array.from({length: instruction[0]}).forEach(() => {
                stack[+instruction[2]-1].push(stack[+instruction[1]-1].pop());
            })
            return stack;
        }, JSON.parse(JSON.stringify(startStacks)))
        .map(stack => stack[stack.length-1]).join("")
    submit(1, newStack);


    await expectTest(2, "MCD");
    const newStack2 = instructions
        .reduce((stack, instruction) => {
            const middle = []
            Array.from({length: instruction[0]}).forEach(() => {
                middle.push(stack[+instruction[1]-1].pop());
            })
            Array.from({length: instruction[0]}).forEach(() => {
               stack[+instruction[2]-1].push(middle.pop());
            })
            return stack;
        }, JSON.parse(JSON.stringify(startStacks)))
        .map(stack => stack[stack.length-1]).join("")
    submit(2, newStack2);

})