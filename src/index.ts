import { ErrorRequestHandler, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import dotenv from "dotenv";

const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const port: string | Number = process.env.PORT || 5000;

const errorHandel: ErrorRequestHandler = (err: HttpError, req, res, next) => {
    console.log(err.message, err.statusCode);
    const message: string = `${err.message} : ${err.statusCode}`;
    res.send(message
    )
}
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');
const { query } = require('express');
dotenv.config();




app.use(cors());
app.use(express.json());






/* Database here */
/* Database here */
/* Database here */
/* Database here */


const uri: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xh4av.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        console.log(
            "Server and Database connection succesfully!");
        const BanglaEcommerce = client.db("Bangla-E-commerce");
        const users = BanglaEcommerce.collection("users");
        const categoris = BanglaEcommerce.collection("category");




        // storing users 
        // new user 
        app.post("/users", async (req: Request, res: Response) => {
            const user: { email: string | null, displayName: string | null, AccountType: string } = req.body;
            const result = await users.insertOne(user);
            // console.log('heating');
            res.send(result);
        })

        // existing user 
        app.put("/users", async (req: Request, res: Response) => {
            const user: { email: string | null, displayName: string | null, AccountType: string } = req.body;
            const filter: { email: string | null } = { email: user.email };
            const options: { upsert: boolean } = { upsert: true };
            const updateDoc: { $set: { email: string | null, displayName: string | null, AccountType: string } } = { $set: user };
            const result = await users.updateOne(filter, updateDoc, options);
            // console.log('heating');
            res.json(result);
        })

        /* Category part */
        app.put("/category/:category", async (req: Request, res: Response) => {
            const category: string = req.params.category;
            const filter: { categoryName: string } = { categoryName: category };
            const options: { upsert: boolean } = { upsert: true };
            const updateDoc: { $set: { categoryName: string } } = { $set: { categoryName: category } };
            const result = await categoris.updateOne(filter, updateDoc, options);
            console.log(result, "hetting");
            res.json(result);
        })

        app.get("/categories", async (req: Request, res: Response) => {
            const cursor = categoris.find({});
            const result: {
                _id: string,
                categoryName: string,
            } = await cursor.toArray();
            // console.log(result);
            res.send(result);
        })







        /* write your code before this middle ware, this was youse to unable routes */
        app.use(() => {
            throw createHttpError(404, "route not found");
        })
        app.use(errorHandel);
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

/* Database here */
/* Database here */
/* Database here */
/* Database here */




app.get("/", (req: Request, res: Response) => {
    console.log("all is ok and port:", port);
    res.send(`server is running on port: ${port}`);
})




app.listen(port, () => {
    console.log("server is running now on port:", port);
})