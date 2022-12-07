import {playDay} from "../deno_aoc.ts";

playDay(3, async (input, submit, expectTest) => {

    await expectTest(1, 157);

    function getSameChars(line1: string, line2: string | string[]) {
        return [...line1].filter(char => [...line2].indexOf(char) !== -1);
    }

    const answer1 = input
        .split("\n")
        .filter(line => line.length > 0)
        .map(line => [line.slice(0,line.length/2), line.slice(line.length/2)])
        .map(([line1,line2]) => getSameChars(line1, line2)[0])
        .map(char => [..."0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"].indexOf(char))
        .reduce((a,b) => a+b, 0)

    await submit(1, answer1);

    await expectTest(2, 70);
    const answer2 = input
        .split("\n")
        .filter(line => line.length > 0)
        .reduce((groups, line, index) => (index % 3 ? groups[groups.length-1].push(line) : groups.push([line])) && groups,[])
        .map(elfGroup => getSameChars(elfGroup[2], getSameChars(elfGroup[0], elfGroup[1]))[0])
        .map(char => [..."0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"].indexOf(char))
        .reduce((a,b) => a+b, 0)


    await submit(2, answer2);

})