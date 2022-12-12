import {playDay} from "../deno_aoc.ts";

class Monkey {
    public items: number[];
    public operation: (old: number) => number;
    public test: (value: number) => boolean;
    public divBy: number;
    public testTrueThrowTo: number;
    public testFalseThrowTo: number;
    public inspectedCount = 0;

    constructor(monkeyData: string) {
        const lines = monkeyData.split("\n");
        this.items = lines[1].split(": ")[1].split(", ").map(value => +value);
        this.operation = (old: number) => +eval(lines[2].split("new = ")[1].replace(/old/g, old+""));
        this.divBy = +lines[3].split("divisible by ")[1];
        this.test = (test: number) => (this.divBy % test) === 0;
        this.testTrueThrowTo = +lines[4].split("true: throw to monkey")[1];
        this.testFalseThrowTo = +lines[5].split("false: throw to monkey")[1];
    }
}

playDay(11, async (input, submit, expectTest) => {

    await expectTest(1, 10605);

    let monkeys = input.split("\n\n").filter(x => x).map(monkeyData => new Monkey(monkeyData));

    Array.from({length: 20}).forEach((x, round) => {
        monkeys.forEach((monkey, index) => {
            Array.from({length: monkey.items.length}).forEach((items, iindex) => {
                monkey.inspectedCount++;
                const original = monkey.items.shift();
                const item = Math.floor(monkey.operation(original)/3);
                const target = item%monkey.divBy===0 ? monkey.testTrueThrowTo : monkey.testFalseThrowTo;
                monkeys[target].items.push(item)
            })
        });
    })

    const most = monkeys.map(m => m.inspectedCount).sort((a,b) => b-a);
    await submit(1, most[0]*most[1])

    
    await expectTest(2, 2713310158);

    monkeys = input.split("\n\n").filter(x => x).map(monkeyData => new Monkey(monkeyData));
    const lcm = monkeys.reduce((product, monkey) => product * monkey.divBy, 1);

    Array.from({length: 10000}).forEach(() => {
        monkeys.forEach((monkey) => {
            Array.from({length: monkey.items.length}).forEach(() => {
                monkey.inspectedCount++;
                const original = monkey.items.shift();
                const item = Math.floor(monkey.operation(original)%lcm);
                const target = item%monkey.divBy===0 ? monkey.testTrueThrowTo : monkey.testFalseThrowTo;
                monkeys[target].items.push(item)
            })
        });
    })

    const most2 = monkeys.map(m => m.inspectedCount).sort((a,b) => b-a);
    submit(2, most2[0]*most2[1])



})