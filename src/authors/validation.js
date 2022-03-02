import { body } from "express-validator";

export const newAuthorValidation = [
  body("name").exists().withMessage("name is a mandatory field."),
  body("surname").exists().withMessage("surname is a mandatory field."),
  body("email").isEmail().withMessage("email is a mandatory field."),
  body("date-of-birth")
    .isDate()
    .withMessage("Date of Birth is a mandatory field."),
];
