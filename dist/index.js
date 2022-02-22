"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const errorHandel = (err, req, res, next) => {
    console.log(err.message, err.statusCode);
    const message = `${err.message} : ${err.statusCode}`;
    res.send(message);
};
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');
const { query } = require('express');
dotenv_1.default.config();
app.use(cors());
app.use(express.json());
/* Database here */
/* Database here */
/* Database here */
/* Database here */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xh4av.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Server and Database connection succesfully!");
            const BanglaEcommerce = client.db("Bangla-E-commerce");
            const users = BanglaEcommerce.collection("users");
            const categoris = BanglaEcommerce.collection("category");
            // storing users 
            // new user 
            app.post("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const user = req.body;
                const result = yield users.insertOne(user);
                // console.log('heating');
                res.send(result);
            }));
            // existing user 
            app.put("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const user = req.body;
                const filter = { email: user.email };
                const options = { upsert: true };
                const updateDoc = { $set: user };
                const result = yield users.updateOne(filter, updateDoc, options);
                // console.log('heating');
                res.json(result);
            }));
            /* Category part */
            app.put("/category/:category", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const category = req.params.category;
                const filter = { categoryName: category };
                const options = { upsert: true };
                const updateDoc = { $set: { categoryName: category } };
                const result = yield categoris.updateOne(filter, updateDoc, options);
                console.log(result, "hetting");
                res.json(result);
            }));
            app.get("/categories", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = categoris.find({});
                const result = yield cursor.toArray();
                // console.log(result);
                res.send(result);
            }));
            app.use(() => {
                throw (0, http_errors_1.default)(404, "route not found");
            });
            app.use(errorHandel);
        }
        finally {
            //   await client.close();
        }
    });
}
run().catch(console.dir);
/* Database here */
/* Database here */
/* Database here */
/* Database here */
app.get("/", (req, res) => {
    console.log("all is ok and port:", port);
    res.send(`server is running on port: ${port}`);
});
app.listen(port, () => {
    console.log("server is running now on port:", port);
});
