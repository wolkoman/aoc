import { playDay } from "../deno_aoc.ts";

playDay(8, async (input, submit, expectTest) => {

    await expectTest(1, 21);
    await expectTest(2, 8);

    const lines = input.split("\n").filter(line => !!line);
    const width = lines[0].length;
    const height = lines.length;

    const visibleTrees = Array.from({ length: width }).flatMap((o, x) => Array.from({ length: height }).map((o, y) => {
        if (x === 0 || x === width - 1) return true;
        if (y === 0 || y === height - 1) return true;
        const h = +lines[y][x];
        const visible = [
            Array.from({ length: x }).map((o, ox) => lines[y][ox]),
            Array.from({ length: width - (x + 1) }).map((o, ox) => lines[y][x + 1 + ox]),
            Array.from({ length: y }).map((o, oy) => lines[oy][x]),
            Array.from({ length: height - (y + 1) }).map((o, oy) => lines[y + 1 + oy][x]),
        ]
            .map(lineTrees => lineTrees.every(lineTree => +lineTree < h))
            .filter(visible => visible).length > 0;
        return visible
    })).filter(x => x).length;

    submit(1, visibleTrees);

    const treeScores = Array.from({ length: width }).flatMap((o, x) => Array.from({ length: height }).map((o, y) => {
        const h = +lines[y][x];
        const score = [
            Array.from({ length: x }).map((o, ox) => +lines[y][x - (ox + 1)]),
            Array.from({ length: width - (x + 1) }).map((o, ox) => +lines[y][x + 1 + ox]),
            Array.from({ length: y }).map((o, oy) => +lines[y - (oy + 1)][x]),
            Array.from({ length: height - (y + 1) }).map((o, oy) => +lines[y + 1 + oy][x]),
        ]
            .map(lineTrees => lineTrees.reduce(({ blocked, score }, tree) => blocked
                ? { blocked, score }
                : { blocked: tree >= h, score: score + 1 }, { blocked: false, score: 0 }));
        return score.map(x => x.score).reduce((product, x) => product * x, 1)
    }));

    submit(2, Math.max(...treeScores));
})