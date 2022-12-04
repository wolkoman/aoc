import {getPayload} from "../deno_aoc.ts";

(async function () {

    const input = await getPayload(1);
    const caloriesSum = input
        .split("\n\n")
        .map(calories => calories
            .split("\n")
            .filter(value => !!value)
            .reduce((sum, calory) => sum + +calory, 0)
        ).filter(sum => sum !== NaN);
    const caloryMax = Math.max(...caloriesSum);
    const topThreeSum = caloriesSum
        .sort((a,b) => b-a)
        .slice(0,3)
        .reduce((sum, value) => sum+value);

    console.log({answer1: caloryMax, answer2: topThreeSum});


})()