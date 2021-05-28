import express from "express";
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import filesRouter from "./files/index.js";
import mediasRouter from "./medias/index.js"
import reviewsRouter from "./reviews/index.js";
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001

const publicFolderPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../public"
  );
// ******** MIDDLEWARES ************
const loggerMiddleware = (req, res, next) => {
    console.log(`Request method: ${req.method} ${req.url} -- ${new Date()}`)
    next()
}

// ******** CORS ************
const whitelist = [process.env.FRONTEND_DEV_URL, process.env.FRONTEND_CLOUD_URL]
const corsOptions = {
    origin: function (origin, next) {
        console.log("ORIGIN ", origin)
        if (whitelist.indexOf(origin) !== -1) {
            // origin allowed
            next(null, true)
        } else {
            // origin not allowed
            next(new Error("CORS TROUBLES!!!!!"))
        }
    },
}

server.use(express.static(publicFolderPath));
server.use(cors(corsOptions))
server.use(loggerMiddleware)
server.use(express.json())

// ******** ROUTES ************
server.use("/media", filesRouter);
server.use("/medias", mediasRouter)
server.use("/reviews", reviewsRouter);

// ******** ERROR MIDDLEWARES ************
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
})
