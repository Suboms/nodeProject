import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { router } from "./routes/route";
import bodyParser from 'body-parser';

const expressApp = (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(morgan('tiny'));
    app.use("/api", router);    

    return app;
}

export { expressApp };