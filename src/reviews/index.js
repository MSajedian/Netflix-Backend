import express from "express";
import uniqid from "uniqid";
import createError from "http-errors";
import { validationResult } from "express-validator";
import { reviewsValidation } from "./validation.js";
import { getReviews, writeReviews } from "../lib/fs-tools.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:id", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const review = reviews.find((elem) => elem.elementId === req.params.id);
    if (review) {
      res.send(review);
    } else {
      next(
        createError(404, `Review with the id of ${req.params.id} is not founded!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post("/", reviewsValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newReview = {
        ...req.body,
        elementId: uniqid(),
        createdAt: new Date(),
      };
      const reviews = await getReviews();
      reviews.push(newReview);
      await writeReviews(reviews);

      res.status(201).send({ elementId: newReview.elementId });
    } else {
      next(createError(400, { errorList: errors }));
    }
  } catch (error) {
    next(error);
  }
});

// reviewsRouter.put("/:id", reviewsValidation, async (req, res, next) => {
//   try {
//     const reviews = await getReviews();
//     const errors = validationResult(req);

//     if (errors.isEmpty()) {
//       const remainingReview = reviews.filter(
//         (elem) => elem.elementId !== req.params.id
//       );
//       const oldReview = reviews.filter((elem) => elem.elementId === req.params.id);
//       const updatedReview = {
//         ...req.body,
//         elementId: req.params.id,
//         createdAt: oldReview.createdAt,
//         updatedAt: new Date(),
//       };

//       remainingReview.push(updatedReview);
//       await writeReviews(remainingReview);

//       res.send(
//         `the Review with id of ${req.params.id} was updated successfully`
//       );
//     } else {
//       next(createError(400, { errorList: errors }));
//     }
//   } catch (error) {
//     next(error);
//   }
// });

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const remainingReview = reviews.filter(
      (elem) => elem.elementId !== req.params.id
    );
    await writeReviews(remainingReview);
    res.status(204).send("deleted successfully");
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
