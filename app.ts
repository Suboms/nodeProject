import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { router } from "./routes/route";

const expressApp = (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(morgan('tiny'));
    app.use("/api", router);    

    return app;
}

export { expressApp };