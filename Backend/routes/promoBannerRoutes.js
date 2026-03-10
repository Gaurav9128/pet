import express from "express";
import upload from "../middleware/multer.js";

import {
 addPromoBanner,
 listPromoBanner,
 deletePromoBanner
} from "../controllers/promoBannerController.js";

const promoBannerRouter = express.Router();

promoBannerRouter.post(
"/add",
upload.single("image"),
addPromoBanner
);

promoBannerRouter.get(
"/list",
listPromoBanner
);

promoBannerRouter.delete("/delete/:id", deletePromoBanner);

export default promoBannerRouter;