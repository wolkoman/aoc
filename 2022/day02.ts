import {playDay} from "../deno_aoc.ts";

playDay(2, async (input, submit, expectTest) => {

    const payload = input
        .split("\n")
        .map(round => round.split(" "))
        .filter(round => round.length === 2);

    await expectTest(1, "15");
    const rounds = payload
        .map(round => ({
            enemy: ['A', 'B', 'C'].indexOf(round[0]),
            me: ['X', 'Y', 'Z'].indexOf(round[1])
        })).map(({enemy,me}) => ({
            pickPoints: me+1,
            winPoints: me === enemy ? 3 : ((me === (enemy+1)%3) ? 6 : 0)
        })).reduce<number>((sum,round) => sum + round.winPoints + round.pickPoints, 0);
    await submit(1, rounds+"");

    await expectTest(2, "12");
    const rounds2 = payload
        .map(round => ({
            enemy: ['A', 'B', 'C'].indexOf(round[0]),
            needTo: ['X', 'Y', 'Z'].indexOf(round[1])
        })).map(({enemy,needTo}) => ({
            me: needTo === 1 ? enemy : (needTo === 0 ? (enemy+2)%3 : (enemy+1)%3),
            win: needTo
        })).map(({me,win}) => ({
            pickPoints: me+1,
            winPoints: [0,3,6][win]
        })).reduce<number>((sum,round) => sum + round.winPoints + round.pickPoints, 0);
    await submit(2, rounds2+"");
})