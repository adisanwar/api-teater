import express from "express";
import {publicRouter} from "../route/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import {apiRouter} from "../route/api";
import cors from 'cors';
import path from 'path';

export const web = express();

// // Middleware untuk melayani file statis dari direktori "src/img"
// web.use('/img', express.static(path.join(__dirname, 'src', 'img')));
web.use(express.static('public'));
web.use('/img', express.static('img'));

web.use(cors());
web.use(express.json());
web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleware);
