import { body } from "express-validator";

export const newBlogValidation = [
  body("category").exists().withMessage("category is a mandatory field."),
  body("title").exists().withMessage("title is a mandatory field."),
  body("cover").exists().withMessage("cover is a mandatory field."),
  body("readTime.value")
    .exists()
    .isNumeric()
    .withMessage("readTime is a mandatory field."),
  body("readTime.unit").exists().withMessage("Unit is a mandatory field."),
  body("author.name")
    .exists()
    .withMessage("authors name is a mandatory field."),
];
