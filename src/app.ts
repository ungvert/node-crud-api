import { once } from "events";
import { createServer } from "./createServer.js";
import "dotenv/config";
const server = await createServer();

server.listen(process.env.PORT);

await once(server, "listening");
console.log(`Server started: http://localhost:${process.env.PORT}`);
