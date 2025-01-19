"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        text: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    },
    owner: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
});
const postModel = mongoose_1.default.model('posts', postSchema);
exports.default = postModel;
