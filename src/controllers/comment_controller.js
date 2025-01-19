"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _controller_1 = require("./_controller");
const comment_model_1 = __importDefault(require("../models/comment_model"));
class CommentController extends _controller_1._Controller {
    constructor() {
        super(comment_model_1.default);
    }
}
exports.default = new CommentController();
