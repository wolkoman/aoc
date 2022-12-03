import { config } from "https://deno.land/x/dotenv/mod.ts";

export async function getPayload(day: number, year = 2022) {
    const payloadPath = `./${year}/day${String(day).padStart(2, '0')}`;
    const exists = await Deno.exists(payloadPath);
    if(exists)
        return await Deno.readTextFile(payloadPath);

    return await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: {
            cookie: `session=${config().COOKIE}`
        }
    }).then(response => response.text())
        .then(payload => {
            await Deno.writeTextFile(payloadPath, payload)
            return payload;
        })
}