import { once } from "events";
import { createServer } from "./createServer.js";

const server = await createServer();

server.listen(8000);

await once(server, "listening");
