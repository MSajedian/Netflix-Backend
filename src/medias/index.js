import express from "express";
import uniqid from "uniqid";
import createError from "http-errors";
import { validationResult } from "express-validator";
import { mediasValidation } from "./validation.js";
import { getMedias, writeMedias } from "../lib/fs-tools.js";

const mediasRouter = express.Router();

mediasRouter.get("/", async (req, res, next) => {
  try {
    const medias = await getMedias();
    if (req.query.category) {
      const filteredMedias = medias.filter(
        (elem) => elem.category === req.query.category
      );

      if (filteredMedias.length > 0) {
        res.send(filteredMedias);
      } else {
        next(createError(404, `no media found in ${req.query.category}!`));
      }
    } else {
      res.send(medias);
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.get("/:id", async (req, res, next) => {
  try {
    const medias = await getMedias();
    const media = medias.find((elem) => elem.imdbID === req.params.id);
    if (media) {
      res.send(media);
    } else {
      next(
        createError(404, `media with the id of ${req.params.imdbID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const reviews = await getReviews();

    const mediaReviews = reviews.filter(
      (elem) => elem.mediaId === req.params.id
    );

    res.send(mediaReviews);
  } catch (error) {
    next(error);
  }
});

mediasRouter.post("/", mediasValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newMedia = {
        ...req.body,
        imdbID: uniqid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const medias = await getMedias();
      medias.push(newMedia);
      await writeMedias(medias);

      res.status(201).send({ imdbID: newMedia.imdbID });
    } else {
      next(createError(400, { errorList: errors }));
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.put("/:id", mediasValidation, async (req, res, next) => {
  try {
    const medias = await getMedias();
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const remainingMedia = medias.filter(
        (elem) => elem.imdbID !== req.params.id
      );
      const oldMedia = medias.filter((elem) => elem.imdbID === req.params.id);
      const updatedMedia = {
        ...req.body,
        imdbID: req.params.id,
        createdAt: oldMedia.createdAt,
        updatedAt: new Date(),
      };

      remainingMedia.push(updatedMedia);
      await writeMedias(remainingMedia);

      res.send(
        `the media with id of ${req.params.id} was updated successfully`
      );
    } else {
      next(createError(400, { errorList: errors }));
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.delete("/:id", async (req, res, next) => {
  try {
    const medias = await getMedias();
    const remainingMedia = medias.filter(
      (elem) => elem.imdbID !== req.params.id
    );
    await writeMedias(remainingMedia);
    res.status(204).send("deleted successfully");
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
