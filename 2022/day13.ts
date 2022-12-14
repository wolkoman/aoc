import { playDay } from "../deno_aoc.ts";


playDay(13, async (input, submit, expectTest) => {

    await expectTest(1, 13);
    await expectTest(2, 140);

    function parseLine(line: string) {
        if (line === "[]") return [];
        if (line.startsWith("[")) {
            return line.slice(1, line.length).split("").reduce<{ level: number, items: string[], current: string }>((result, char) => ({
                level: (char === "[" ? 1 : (char === "]" ? -1 : 0)) + result.level,
                items: result.level === 0 && [",", "]"].includes(char) ? [...result.items, result.current] : result.items,
                current: result.level === 0 && [",", "]"].includes(char) ? "" : result.current + char
            }), { level: 0, items: [], current: "" }).items.map(line => parseLine(line));
        } else {
            return +line;
        }
    }

    type NumList = (number | NumList)[];

    function compare(a: NumList, b: NumList) {
        if (Number.isInteger(a) && Number.isInteger(b)) {
            return a === b ? null : a <= b;
        }
        if (Number.isInteger(a)) {
            a = [a];
        }
        if (Number.isInteger(b)) {
            b = [b];
        }
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
            const itemcheck = compare(a[i] as NumList, b[i] as NumList);
            if (itemcheck !== null) return itemcheck;
        }
        return a.length === b.length ? null : a.length < b.length;
    }

    const sum = input
        .split("\n\n")
        .map(pair => pair
            .split("\n")
            .filter(pair => pair)
            .map(line => parseLine(line))
        ).map(([a, b], i) => compare(a, b) ? i + 1 : 0)
        .reduce((sum, x) => sum + x, 0)
    submit(1, sum);

    const sum2 = input
        .split("\n")
        .filter(pair => pair)
        .map(line => parseLine(line))
        .concat([[2]], [[6]])
        .sort((b, a) => compare(a, b) ? 1 : -1)
        .map((x, i) => ["[2]", "[6]"].includes(JSON.stringify(x)) ? i + 1 : 0)
        .filter(x => x)

    submit(2, sum2[0] * sum2[1]);

})