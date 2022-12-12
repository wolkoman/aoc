import { playDay } from "../deno_aoc.ts";

const alphabet = "SabcdefghijklmnopqrstuvwxyzE";

playDay(12, async (input, submit, expectTest) => {

    await expectTest(1, 31);
    await expectTest(2, 29);

    const fields: { height: string, x: number, y: number, prev?: string, steps: number, visited: boolean }[] = input.split("\n").filter(x => x).flatMap((line, y) => line.split("").map((height, x) => ({ height, x, y, prev: undefined, steps: height === "S" ? 0 : Infinity, visited: false })));

    Array.from({ length: fields.length }).forEach(() => {
        const current = fields.filter(field => !field.visited).sort((a, b) => a.steps - b.steps)[0]!;
        current.visited = true;
        fields
            .filter(({ x, y }) => Math.abs(current.x - x) + Math.abs(current.y - y) === 1)
            .filter(neighbor => alphabet.indexOf(neighbor.height) <= alphabet.indexOf(current.height) + 1)
            .filter(climable => climable.steps > current.steps + 1)
            .forEach(target => {
                target.steps = current.steps + 1;
                target.prev = current.height;
            });
    })

    submit(1, fields.find(height => height.height === "E")!.steps)

    const fields2: { height: string, x: number, y: number, prev?: any, steps: number, visited: boolean, mark: string }[] = input.split("\n").filter(x => x).flatMap((line, y) => line.split("").map((height, x) => ({ height, x, y, prev: undefined, steps: height === "S" || height === "a" ? 0 : Infinity, visited: false, mark: undefined })));

    Array.from({ length: fields2.length }).forEach(() => {
        const current = fields2.filter(field => !field.visited).sort((a, b) => a.steps - b.steps)[0]!;
        current.visited = true;
        fields2
            .filter(({ x, y }) => Math.abs(current.x - x) + Math.abs(current.y - y) === 1)
            .filter(neighbor => alphabet.indexOf(neighbor.height) <= alphabet.indexOf(current.height) + 1)
            .filter(climable => climable.steps > current.steps + 1)
            .forEach(target => {
                target.steps = current.steps + 1;
                target.prev = {x: current.x, y: current.y};
            });
    });

    let prev = fields2.find(height => height.height === "E")!;
    const stepsToE = prev.steps;
    
    /*
    Array.from({length: stepsToE}).forEach(() => {
        prev.mark = prev.height;
        prev = fields2.find(field => field.x === prev.prev.x && field.y === prev.prev.y)!;
    })

    console.log(Array.from({ length: Math.max(...fields2.map(field => field.y)) })
        .map((line,y) => Array
            .from({ length: Math.max(...fields2.map(field => field.x)) })
            .map((o,x) => fields2.find(field => field.x === x && field.y === y)!.mark ?? ".")
            .join(""))
        .join("\n"))
    */

    submit(2, stepsToE)



})