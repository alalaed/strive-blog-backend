import express from "express";
import listEndpoints from "express-list-endpoints";
import authors from "./authors/index.js";

const server = express();
const port = 3001;

server.use(express.json());

server.use("/authors", authors);

server.listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});

console.table(listEndpoints(server));
