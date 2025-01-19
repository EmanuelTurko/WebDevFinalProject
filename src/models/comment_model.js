"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    }
});
const commentModel = mongoose_1.default.model('comments', commentSchema);
exports.default = commentModel;
