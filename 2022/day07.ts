import { playDay } from "../deno_aoc.ts";

playDay(7, 1, async (input, submit, expectTest) => {

    await expectTest(1, "95437");
    await expectTest(2, "24933642");

    interface File { name: string; parent: string; size: number, isFile: boolean };
    interface State {
        files: File[];
        currentDirectory: string[];
    }

    const { files }: { files: File[] } = input.split("\n").reduce((data: State, instruction: string) => {
        let { files, currentDirectory } = data;
        if (instruction.startsWith("$ cd ..")) {
            currentDirectory.pop();
        } else if (instruction.startsWith("$ cd")) {
            currentDirectory.push(instruction.slice(5));
        } else if (instruction.startsWith("$ ls")) {
        } else if (instruction.startsWith("dir ")) {
            files.push({ name: [...currentDirectory, instruction.slice(4)].join("/"), size: 0, parent: currentDirectory.join("/"), isFile: false });
        } else {
            files.push({ name: [...currentDirectory, instruction.split(" ")[1]].join("/"), size: +instruction.split(" ")[0], parent: currentDirectory.join("/"), isFile: true });
        }
        return { currentDirectory, files };
    }, { currentDirectory: [], files: [] });

    function getSizeOfDir(dir: { name: string, parent: string }) {
        const childs = files.filter(file => file.parent === dir.name).reduce((sum, file) => sum + (file.isFile ? file.size : getSizeOfDir(file)), 0);
        return childs;
    }

    const dir = files.map(file => file.isFile ? file : ({ ...file, size: getSizeOfDir(file) }));
    await submit(1, dir.filter(dir => !dir.isFile && dir.size <= 100000).reduce((sum, file) => sum + file.size, 0));
    const freeUp = dir.filter(dir => dir.parent === "/").reduce((sum, file) => sum + file.size, 0) - 40000000;
    await submit(2, dir.filter(dir => !dir.isFile && dir.size >= freeUp).sort((a, b) => a.size - b.size)[0].size)




})