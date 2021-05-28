import express from "express";
import multer from "multer";
import createError from "http-errors";
import { readMediaPictures, writeMediaPictures } from "../lib/fs-tools.js";

// IMAGE UPLOAD (POST /media/:id/upload)
const filesRouter = express.Router();

filesRouter.post(
  "/:id/upload",
  multer().single("mediaImg"),
  async (req, res, next) => {
    try {
      // console.log(req.params.id);
      console.log(req);
      if (req.file.buffer) {
        writeMediaPictures(req.params.id + ".jpg", req.file.buffer);
      } else {
        next(createError(400, "No file attached"));
      }
      res.status(201).send("Image saved");
    } catch (error) {
      console.log(error);
    }
  }
);

export default filesRouter;
