import {resolve} from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const rootDir = resolve(__dirname, "../");

export {
    rootDir,
    __dirname
}