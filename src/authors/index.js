import express, { response } from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const currentFilePath = fileURLToPath(import.meta.url);

const parentFolderPath = dirname(currentFilePath);

const authorsJSONPath = join(parentFolderPath, "authors.json");

const authorsRouter = express.Router();

// POST API Route --- All Authors
authorsRouter.post("/", (req, res) => {
  const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };
  const authorsArray = fs.readFileSync(authorsJSONPath);
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  res.status(201).send(newAuthor.id);
});

// GET API Route --- All Authors
authorsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const authorsArray = JSON.parse(fileContent);
  res.send(authorsArray);
});

// GET API Route --- 1 Author
authorsRouter.get("/:authorId", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const authorsArray = JSON.parse(fileContent);
  const author = authorsArray.find((a) => a.id === req.params.authorId);
  res.send(author);
});

// GET API Route --- Delete 1 Author

authorsRouter.delete("/:authorId", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const authorsArray = JSON.parse(fileContent);
  const author = authorsArray.filter((a) => a.id !== req.params.authorId);
  const modifiedArray = fs.writeFileSync(
    authorsJSONPath,
    JSON.stringify(author)
  );
  res.send(modifiedArray);
});

export default authorsRouter;
