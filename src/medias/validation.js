import { body } from "express-validator"

export const mediasValidation = [
  body("Title").exists().withMessage("Title is a mandatory field!"),
  body("Year").exists().withMessage("Year is a mandatory field!"),
  body("Type").exists().withMessage("Type is a mandatory field!"),
  body("Poster").exists().withMessage("Poster is a mandatory field!"),
]
