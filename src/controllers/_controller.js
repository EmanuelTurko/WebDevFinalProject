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
Object.defineProperty(exports, "__esModule", { value: true });
exports._Controller = void 0;
class _Controller {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 12 } = req.query;
                const filter = req.query;
                const data = yield this.model
                    .find(filter)
                    .sort({ createdAt: -1 })
                    .skip((Number(page) - 1) * Number(limit))
                    .limit(Number(limit));
                res.status(200).send(data);
            }
            catch (err) {
                res.status(400).send({ error: err.message });
            }
        });
    }
    ;
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.create(req.body);
                const savedData = yield data.save();
                res.status(201).send(savedData);
            }
            catch (err) {
                res.status(401).send({ error: err.message });
            }
        });
    }
    ;
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updatedData = yield this.model.findByIdAndUpdate(id, req.body, {
                    new: true,
                });
                if (!updatedData) {
                    res.status(404).send('Data not found');
                    return;
                }
                yield updatedData.save();
                res.status(200).send(updatedData);
            }
            catch (err) {
                res.status(400).send({ error: err.message });
            }
        });
    }
    ;
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deletedData = yield this.model.findByIdAndDelete(id);
                if (!deletedData) {
                    res.status(404).send('Data not found');
                    return;
                }
                res.status(200).send(deletedData);
            }
            catch (err) {
                res.status(400).send({ error: err.message });
            }
        });
    }
    ;
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = yield this.model.findById(id);
                if (!data) {
                    res.status(404).send('Data not found');
                    return;
                }
                res.status(200).send(data);
            }
            catch (err) {
                res.status(400).send({ error: err.message });
            }
        });
    }
    like(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports._Controller = _Controller;
