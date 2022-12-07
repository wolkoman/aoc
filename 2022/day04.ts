import {playDay} from "../deno_aoc.ts";

playDay(4, async (input, submit, expectTest) => {



    function isContained(range1: [number, number], range2: [number,number]) {
        return range1[0] >= range2[0] && range1[1] <= range2[1];
    }
    function overlap(range1: [number, number], range2: [number,number]) {
        return range1[0] <= range2[1] && range2[0] <= range1[1];
    }

    await expectTest(1, 2);
    const answer1 = input
        .split("\n")
        .filter(line => line.length > 0)
        .map(line => line.split(",").map(x => x.split("-").map(x => +x)))
        .filter(([range1,range2]) => isContained(range1,range2) || isContained(range2, range1)).length;
    await submit(1, answer1);

    await expectTest(2, 4);
    const answer2 = input
        .split("\n")
        .filter(line => line.length > 0)
        .map(line => line.split(",").map(x => x.split("-").map(x => +x)))
        .filter(([range1,range2]) => overlap(range1,range2) || overlap(range2, range1)).length;
    await submit(2, answer2);

})