import { playDay } from "../deno_aoc.ts";


playDay(14, async (input, submit, expectTest) => {

    await expectTest(1, 24);
    await expectTest(2, 93);

    const rockPaths = input.split("\n").flatMap(line => line.split(" -> ")
        .map(coordinates => coordinates.split(",").map(value => +value))
        .map((current, index, all) => index === 0 ? null : [all[index - 1], current])
        .filter(pair => pair)
    );
    const rockPositions = rockPaths.flatMap(([[x1, y1], [x2, y2]]) =>
        Array.from({ length: Math.abs(x1 - x2) + Math.abs(y1 - y2) + 1 })
            .map((x, index) => [x1 + Math.sign(x2 - x1) * index, y1 + Math.sign(y2 - y1) * index])
    );

    {
        const startY = 0//;Math.min(...rockPositions.map(([x, y]) => y));
        const height = Math.max(...rockPositions.map(([x, y]) => y)) - startY + 1;
        const startX = Math.min(...rockPositions.map(([x, y]) => x));
        const width = Math.max(...rockPositions.map(([x, y]) => x)) - startX + 1;
        const landscape: ("." | "#" | "o")[][] = Array.from({ length: height }).map((o, y) =>
            Array.from({ length: width }).map((o, x) =>
                rockPositions.find(([mx, my]) => mx - startX === x && my - startY === y) ? "#" : "."
            )
        );

        let sandLost = false;
        let sandCount = 0
        while (!sandLost) {
            const sand = { x: 500, y: 0 };
            let possibilies = [sand.x, sand.x - 1, sand.x + 1];
            let mat = possibilies.map(x => landscape[sand.y - startY + 1][x - startX]);
            while (mat.some(m => m === "." || m === undefined) && !sandLost) {
                sand.y++;
                if (mat[0] === "." || mat === undefined) sand.x = possibilies[0];
                else if (mat[1] === "." || mat === undefined) sand.x = possibilies[1]
                else if (mat[2] === "." || mat === undefined) sand.x = possibilies[2];
                if (sand.x > startX + width || sand.x < startX || sand.y < startY || sand.y > startY + height) {
                    sandLost = true;
                }
                possibilies = [sand.x, sand.x - 1, sand.x + 1];
                mat = possibilies.map(x => landscape[sand.y - startY + 1]?.[x - startX]);
            }
            if (!sandLost) {
                landscape[sand.y - startY][sand.x - startX] = "o";
                sandCount++;
            }
        }

        submit(1, sandCount);

    }


    {


        const height = Math.max(...rockPositions.map(([x, y]) => y)) + 3;
        const startX = Math.min(...rockPositions.map(([x, y]) => x))-height;
        const width = 2*height+Math.max(...rockPositions.map(([x, y]) => x))-startX + 1;
        const landscape2: ("." | "#" | "o")[][] = Array.from({ length: height }).map((o, y) =>
            Array.from({ length: width }).map((o, x) =>
                rockPositions.find(([mx, my]) => mx-startX === x && my === y) || y === height-1 ? "#" : "."
            )
        );

        let sandCount = 0;
        while (landscape2[0][500-startX] === ".") {
            const sand = { x: 500, y: 0 };
            let possibilies = [sand.x, sand.x - 1, sand.x + 1];
            let mat = possibilies.map(x => landscape2[sand.y + 1][x-startX]);
            while (mat.some(m => m === ".") && sand.y < height) {
                sand.y++;
                if (mat[0] === ".") sand.x = possibilies[0];
                else if (mat[1] === ".") sand.x = possibilies[1]
                else if (mat[2] === ".") sand.x = possibilies[2];
                possibilies = [sand.x, sand.x - 1, sand.x + 1];
                mat = possibilies.map(x => landscape2[sand.y + 1]?.[x-startX]);
            }
            landscape2[sand.y][sand.x-startX] = "o";
            sandCount++;
        }

        submit(2, sandCount)
    }


})