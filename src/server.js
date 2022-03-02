import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./authors/index.js";
// import blogsRouter from "./blogs/index.js";
import cors from "cors";
import {
  badRequestHandler,
  notFoundHandler,
  unauthorizedHandler,
  serverErrorHandler,
} from "./errorhandlers.js";

const server = express();
const port = 3001;

server.use(cors());

server.use(express.json());

server.use("/authors", authorsRouter);
server.use("/blogs", blogsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(serverErrorHandler);

server.listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});

console.table(listEndpoints(server));
