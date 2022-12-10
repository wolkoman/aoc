import { playDay } from "../deno_aoc.ts";

type Position = {
    x: number;
    y: number;
};
type Command = ('R' | 'U' | 'L' | 'D');

playDay(9, 7, async (input, submit, expectTest) => {

    await expectTest(1, 88);
    await expectTest(2, 36);


    const commands: Command[] = input
        .split("\n")
        .filter(l => l)
        .map(line => line .split(" "))
        .flatMap(line => Array .from({ length: +line[1] }) .map(() => line[0]))

    function follow(head: Position, tail: Position) {
        const xDistance = Math.abs(head.x - tail.x);
        const yDistance = Math.abs(head.y - tail.y);
        if (xDistance > 1 || yDistance > 1) {
            tail.x += Math.sign(head.x - tail.x);
            tail.y += Math.sign(head.y - tail.y);
        }
    }

    submit(1, calculateRope(commands, Array.from({ length: 2 }).map(() => ({ x: 0, y: 0 }))).length);
    submit(2, calculateRope(commands, Array.from({ length: 10 }).map(() => ({ x: 0, y: 0 }))).length);


    function calculateRope(commands: Command[], rope: Position[]): Position[] {
        const tailPosition: Position[] = []
        commands.forEach(command => {
            rope[0].x += (command === 'R' ? 1 : (command === "L" ? -1 : 0));
            rope[0].y += (command === 'U' ? 1 : (command === "D" ? -1 : 0));

            Array.from({ length: rope.length - 1 }).forEach((o, i) => follow(rope[i], rope[i + 1]));

            const tail = rope[rope.length - 1];
            if (!tailPosition.find(position => position.x === tail.x && position.y === tail.y)) {
                tailPosition.push({ ...tail });
            }
        });
        return tailPosition;
    }
})

function drawRope(rope: Position[]) {
    const minX = Math.min(...rope.map(r => r.x));
    const maxX = Math.max(...rope.map(r => r.x));
    const minY = Math.min(...rope.map(r => r.y));
    const maxY = Math.max(...rope.map(r => r.y));
    const field = Array.from({ length: Math.abs(minY - maxY) + 1 }).map(() => Array.from({ length: Math.abs(minX - maxX) + 1 }).map(() => "."));
    rope.forEach((r, i) => field[r.y - minY][r.x - minX] = i + "");
    console.log(field.map(line => line.join("")).join("\n"), "\n");

}
