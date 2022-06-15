import { once } from "events";
import { createAndStartServer } from "./createAndStartServer.js";

const server = await createAndStartServer();

server.listen(8000);

await once(server, "listening");
