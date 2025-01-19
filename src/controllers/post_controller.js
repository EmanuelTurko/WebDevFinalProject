"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _controller_1 = require("./_controller");
const post_model_1 = __importDefault(require("../models/post_model"));
class PostController extends _controller_1._Controller {
    constructor() {
        super(post_model_1.default);
    }
}
exports.default = new PostController();
