import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newBlogValidation } from "./validation.js";

const blogsRouter = express.Router();

const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogs.json"
);
const getBlog = () => JSON.parse(fs.readFileSync(blogsJSONPath));

const writeBlog = (arr) => fs.writeFileSync(blogsJSONPath, JSON.stringify(arr));

// POST API Route --- All Authors
blogsRouter.post("/", newBlogValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() };

      const blogArray = getBlog();

      blogArray.push(newBlog);

      writeBlog(blogArray);

      res.status(201).send({ id: newBlog.id });
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

blogsRouter.post("/checkEmail", newBlogValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() };
      const blogArray = getBlog();
      const exist = blogArray.some((blog) => blog._id === req.body._id);
      if (exist) {
        res.status(400).send({
          message: "user already exists, please use another email address",
        });
      } else {
        blogArray.push(newBlog);
        fs.writeFileSync(blogsJSONPath, JSON.stringify(blogArray));
        res.status(201).send({ id: newBlog.id });
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
blogsRouter.get("/", (req, res, next) => {
  try {
    const blogArray = getBlog();
    if (req.query && req.query.name) {
      const filteredBlogs = blogArray.filter(
        (author) => author.name === req.query.name
      );
      res.send(filteredBlogs);
    } else {
      res.send(blogArray);
    }
  } catch (error) {
    next(error);
  }
});

// GET API Route --- 1 Author
blogsRouter.get("/:blogId", (req, res, next) => {
  try {
    const blogArray = getBlog();
    const blog = blogArray.find((a) => a.id === req.params.blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(
        createHttpError(
          404,
          `Author with Id ${req.params.blogId} is  not found`
        )
      );
    }
    res.send(blog);
  } catch (error) {
    next(error);
  }
});

// DELETE API Route --- Delete 1 Author

blogsRouter.delete("/:blogId", (req, res, next) => {
  try {
    const blogArray = getBlog();
    const blog = blogArray.filter((a) => a.id !== req.params.blogId);
    const modifiedArray = writeBlog(blog);
    res.send(blog);
  } catch (error) {
    next(error);
  }
});

// PUT API Route --- edit 1 Author
blogsRouter.put("/:blogId", (req, res, next) => {
  try {
    const blogArray = getBlog();
    const index = blogArray.findIndex((a) => a.id === req.params.blogId);
    if (index !== -1) {
      const oldBlog = blogArray[index];
      const updatedBlog = {
        ...oldBlog,
        ...req.body,
        updatedAt: new Date(),
      };
      blogArray[index] = updatedBlog;
      writeBlog(updatedBlog);
      res.send(updatedBlog);
    } else {
      next(
        createHttpError(
          404,
          `Author with Id ${req.params.blogId} is  not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
