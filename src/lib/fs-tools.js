import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicImgFolderPath = join( dirname(fileURLToPath(import.meta.url)), "../../public/img" );

export const getMedias = async () => await readJSON(join(dataFolderPath, "medias.json"));

export const writeMedias = async (content) => await writeJSON(join(dataFolderPath, "medias.json"), content);

export const getReviews = async () => await readJSON(join(dataFolderPath, "reviews.json"));

export const writeReviews = async (content) => await writeJSON(join(dataFolderPath, "reviews.json"), content);

export const getCurrentFolderPath = (currentFile) => dirname(fileURLToPath(currentFile));

export const writeMediaPictures = async (fileName, content) => await writeFile(join(publicImgFolderPath, fileName), content);

export const readMediaPictures = (fileName) => createReadStream(join(publicImgFolderPath, fileName));
