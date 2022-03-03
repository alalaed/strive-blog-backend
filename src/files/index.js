import express from "express";
import multer from "multer";
import { saveAuthorsPictures, saveBlogsPictures } from "../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/uploadSingle",
  multer().single("authors"),
  async (req, res, next) => {
    try {
      console.log("FILE: ", req.file);
      await saveAuthorsPictures(req.file.originalname, req.file.buffer);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/uploadMultiple",
  multer().array("authors"),
  async (req, res, next) => {
    try {
      console.log("FILES: ", req.files);
      const arrayOfPromises = req.files.map((file) =>
        saveBlogsPictures(file.originalname, file.buffer)
      );
      await Promise.all(arrayOfPromises);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);
filesRouter.post(
  "/uploadSingle",
  multer().single("blogs"),
  async (req, res, next) => {
    try {
      console.log("FILE: ", req.file);
      await saveBlogsPictures(req.file.originalname, req.file.buffer);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/uploadMultiple",
  multer().array("blogs"),
  async (req, res, next) => {
    try {
      console.log("FILES: ", req.files);
      const arrayOfPromises = req.files.map((file) =>
        saveAuthorsPictures(file.originalname, file.buffer)
      );
      await Promise.all(arrayOfPromises);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
