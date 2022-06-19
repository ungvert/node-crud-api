import { startServer } from "./server.js";
import "dotenv/config";

const port = Number(process.env.PORT);

await startServer(port);
console.log(`Server started: http://localhost:${port}`);
