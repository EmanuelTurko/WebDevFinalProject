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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const post_route_1 = __importDefault(require("./routes/post_route"));
const comment_route_1 = __importDefault(require("./routes/comment_route"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/posts', post_route_1.default);
app.use('/comments', comment_route_1.default);
const appMain = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const db = mongoose_1.default.connection;
        db.on("error", (err) => {
            console.error(err);
        });
        db.once("open", () => {
            console.log("connected to DB");
        });
        if (process.env.DB_CONNECT === undefined) {
            console.error("Please set the DB_CONNECT environment variable");
            reject();
        }
        else {
            mongoose_1.default.connect(process.env.DB_CONNECT).then(() => {
                console.log("appMain finish");
            });
            resolve(app);
        }
    });
});
exports.default = appMain;
