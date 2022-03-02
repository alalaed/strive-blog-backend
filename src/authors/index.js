import express, { response } from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newAuthorValidation } from "./validation.js";

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
const getAuthor = () => JSON.parse(fs.readFileSync(authorsJSONPath));

const writeAuthor = (arr) =>
  fs.writeFileSync(authorsJSONPath, JSON.stringify(arr));

// POST API Route --- All Authors
authorsRouter.post("/", newAuthorValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };

      const authorsArray = getAuthor();

      authorsArray.push(newAuthor);

      writeAuthor(authorsArray);

      res.status(201).send({ id: newAuthor.id });
    } else {
      next(
        createHttpError(400, "Some errors occurred in req body", { errorsList })
      );
    }
  } catch (error) {
    next(error);
  }
});

// Email check

authorsRouter.post("/checkEmail", newAuthorValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };
      const authorsArray = getAuthor();
      const exist = authorsArray.some(
        (author) => author.email === req.body.email
      );
      if (exist) {
        res.status(400).send({
          message: "user already exists, please use another email address",
        });
      } else {
        authorsArray.push(newAuthor);
        fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
        res.status(201).send({ id: newAuthor.id });
      }
    } else {
      next(
        createHttpError(400, "Some errors occurred in req body", { errorsList })
      );
    }
  } catch (error) {
    next(error);
  }
});

// GET API Route --- All Authors
authorsRouter.get("/", (req, res, next) => {
  try {
    const authorsArray = getAuthor();
    if (req.query && req.query.name) {
      const filteredAuthors = authorsArray.filter(
        (author) => author.name === req.query.name
      );
      res.send(filteredAuthors);
    } else {
      res.send(authorsArray);
    }
  } catch (error) {
    next(error);
  }
});

// GET API Route --- 1 Author
authorsRouter.get("/:authorId", (req, res, next) => {
  try {
    const authorsArray = getAuthor();
    const author = authorsArray.find((a) => a.id === req.params.authorId);
    if (author) {
      res.send(author);
    } else {
      next(
        createHttpError(
          404,
          `Author with Id ${req.params.authorId} is  not found`
        )
      );
    }
    res.send(author);
  } catch (error) {
    next(error);
  }
});

// DELETE API Route --- Delete 1 Author

authorsRouter.delete("/:authorId", (req, res, next) => {
  try {
    const authorsArray = getAuthor();
    const author = authorsArray.filter((a) => a.id !== req.params.authorId);
    const modifiedArray = writeAuthor(author);
    res.send(author);
  } catch (error) {
    next(error);
  }
});

// PUT API Route --- edit 1 Author
authorsRouter.put("/:authorId", (req, res, next) => {
  try {
    const authorsArray = getAuthor();
    const index = authorsArray.findIndex((a) => a.id === req.params.authorId);
    if (index !== -1) {
      const oldAuthor = authorsArray[index];
      const updatedAuthor = {
        ...oldAuthor,
        ...req.body,
        updatedAt: new Date(),
      };
      authorsArray[index] = updatedAuthor;
      writeAuthor(updatedAuthor);
      res.send(updatedAuthor);
    } else {
      next(
        createHttpError(
          404,
          `Author with Id ${req.params.authorId} is  not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
