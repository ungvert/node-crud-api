import http from "http";
import requestSupertest from "supertest";
import { createAndStartServer } from "../createAndStartServer";

let cachedServer: any;

export const getRequestToTestServer = async () => {
  const testServer = cachedServer ?? (await createAndStartServer());
  cachedServer = testServer;

  return requestSupertest(testServer);
};

export const request = await getRequestToTestServer();

// import { testServer } from "./common/testUtils";

// const req = request(testServer);

// const createServer = async () => {
//   const app = express();
//   const server = new ApolloServer(apolloConfig());
//   const httpServer = http.createServer(app);
//   await server.start();
//   server.applyMiddleware({ app });
//   return httpServer;
// };

// export const sendTestRequest = async (
//   query: DocumentNode,
//   {
//     variables = {},
//     headers = {},
//   }: {
//     variables?: any;
//     headers?: { [key: string]: string };
//   } = {}
// ): Promise<any> => {
// const server = cachedServer ?? (await createServer());
// cachedServer = server;
//   Object.entries(headers).forEach(([key, value]) => {
//     requestBuilder.set(key, value);
//   });
//   const { text } = await requestBuilder.send({
//     variables,
//     query: print(query),
//   });
//   return JSON.parse(text);
// };
