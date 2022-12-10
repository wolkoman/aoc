import { playDay } from "../deno_aoc.ts";

playDay(10, 1, async (input, submit, expectTest) => {

    await expectTest(1, 13140);

    let x = 1;
    const instructions = input.split("\n").filter(x => x).flatMap((instruction) => {
        if (instruction.startsWith("addx ")) {
            const oldX = x;
            const newX = +instruction.split(" ")[1] + x;
            x = newX;
            return [oldX, newX];
        };
        return [x];
    });


    const cycles = [
        { index: 0, sprite: [0, 1, 2] },
        { index: 1, sprite: [0, 1, 2] },
        ...instructions
            .map((value, index) => ({ value, index: index + 2 }))
            .map(({ index, value }) => ({ index, sprite: [value - 1, value, value + 1], value }))
    ];

    submit(1, cycles
        .filter(({ index }) => (index + 20) % 40 === 0)
        .reduce((sum, cycle) => sum + cycle.value * cycle.index, 0)
    );


    const pixels = Array.from({ length: 240 }).map((o, pixel) =>
        (cycles[pixel + 1].sprite.includes(pixel % 40) ? "▮" : " ")
        + (pixel % 40 === 39 ? "\n" : "")
    ).join("")

    submit(2, 0, true)

    console.log(pixels);



})