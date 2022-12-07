import {playDay} from "../deno_aoc.ts";

playDay(6, async (input, submit, expectTest) => {

    await expectTest(1, "7");
    await expectTest(2, "19");

    function getPositionOfDistinctString(length: number) {
        for (let i = length; i < input.length; i++) {
            const sub = input.slice(i - length, i);
            const set = [...new Set([...sub])];
            if (set.length === length) {
                return i;
            }
        }
    }

    submit(1, ""+getPositionOfDistinctString(4));
    submit(2, ""+getPositionOfDistinctString(14));


})