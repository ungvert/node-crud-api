import cluster from "cluster";
import { cpus } from "os";
import { pid } from "process";

import { startServer } from "./server.js";
import { updateDb } from "./db.js";

import "dotenv/config";

const port = Number(process.env.PORT);

if (cluster.isPrimary) {
  console.log(`Primary ${pid} is running`);

  for (let i = 0; i < cpus().length; i++) {
    const worker = cluster.fork();
    worker.on("message", syncData);
    worker.on("error", (err) => console.log("Worker error", err));
  }
} else {
  // let db = initialDb;
  // let getDb = (): Database => db;

  process.on("message", async function (msg: any) {
    try {
      if (msg.task && msg.task === "sync") {
        updateDb(msg.data);
      }
    } catch (error) {
      console.log("Worker error", error);
    }
  });

  const id = cluster.worker?.id;
  await startServer(port);
  console.log(`Worker: ${id}, pid: ${pid}, Server started: http://localhost:${port}`);
}

function syncData(msg: any) {
  if (msg.task === "sync") {
    const data = msg.data;

    for (const worker of Object.values(cluster.workers || {})) {
      worker?.send({
        task: "sync",
        data,
      });
    }
  }
}
