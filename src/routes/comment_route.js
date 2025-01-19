"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
const router = express_1.default.Router();
router.get('/', comment_controller_1.default.getAll.bind(comment_controller_1.default));
router.get('/:id', comment_controller_1.default.getById.bind(comment_controller_1.default));
router.post('/', comment_controller_1.default.create.bind(comment_controller_1.default));
router.put('/:id', comment_controller_1.default.update.bind(comment_controller_1.default));
router.delete('/:id', comment_controller_1.default.delete.bind(comment_controller_1.default));
router.put('/:id/like', comment_controller_1.default.like.bind(comment_controller_1.default));
exports.default = router;
