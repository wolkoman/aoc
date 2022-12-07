import { playDay } from "../deno_aoc.ts";

playDay(1, async (input, submit, expectTest) => {

    await expectTest(1, 24000);
    await expectTest(2, 45000);

    const caloriesSum = input
        .split("\n\n")
        .map(calories => calories
            .split("\n")
            .filter(value => !!value)
            .reduce((sum, calory) => sum + +calory, 0)
        ).filter(sum => sum !== NaN);
    const caloryMax = Math.max(...caloriesSum);
    const topThreeSum = caloriesSum
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((sum, value) => sum + value);

    await submit(1, caloryMax);
    await submit(2, topThreeSum);


})