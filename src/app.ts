import { startServer } from "./server.js";
import "dotenv/config";
import { db } from "./db.js";

const port = Number(process.env.PORT);

await startServer(port, () => db);
console.log(`Server started: http://localhost:${port}`);
