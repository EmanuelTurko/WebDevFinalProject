import {Model}  from 'mongoose';
import {Request, Response} from 'express';


export class _Controller<T>{
    model : Model<T>;

    constructor(model: Model<T>){
        this.model = model;
    }

        async getAll(req:Request,res:Response){
            try {
                const {page = 1 , limit = 99} = req.query;
                const filter = req.query as any;
                let sortOrder: 1 | -1 = this.model.modelName.toLowerCase().includes("comments") ? 1 : -1;
                let sortField = "updatedAt";
                const data = await this.model
                    .find(filter)
                    .sort({[sortField]: sortOrder})
                    .skip((Number(page) - 1) * Number(limit))
                    .limit(Number(limit));

                res.status(200).send(data);
                } catch(err:any){
                res.status(400).send({error: err.message});
            }
        };
    async create(req:Request,res:Response){
        try{
            const data = await this.model.create(req.body);
            const savedData = await data.save();
            res.status(201).send(savedData);
        } catch(err:any){
            res.status(401).send({error: err.message});
        }
    };
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const updatedData = await this.model.findByIdAndUpdate(
                id,
                { $set: { content } },
                { new: true }
            );

            if (!updatedData) {
                res.status(404).send('Data not found');
                return;
            }

            res.status(200).send(updatedData);
        } catch (err: any) {
            res.status(402).send({ error: err.message });
        }
    }
    async delete(req:Request,res:Response) {
        try {
            const {id} = req.params;
            const deletedData = await this.model.findByIdAndDelete(id);
            if (!deletedData) {
                res.status(404).send('Data not found');
            }
            res.status(200).send(deletedData);
        } catch (err: any) {
            res.status(403).send({error: err.message});
        }
    };
    async getById(req:Request,res:Response){
        try{
            const {id} = req.params;
            const data = await this.model.findById(id);
            if(!data){
                res.status(404).send('Data not found');
            }
            res.status(200).send(data);
        } catch(err:any){
            res.status(404).send({error: err.message});
        }
    }
    async getByOwner(req:Request,res:Response){
        try{
            const {owner} = req.params;
            const data = await this.model.find({owner: owner});
            if(!data){
                res.status(404).send('Data not found');
            }
            res.status(200).send(data);
        } catch(err:any){
            res.status(405).send({error: err.message});
        }
    }
    /*async deleteMany(req:Request,res:Response){
        try{
            const {postId} = req.params;
            const data = await this.model.deleteMany({postId: postId});
            if(!data){
                res.status(404).send('Data not found');
            }
            res.status(200).send(data);
        } catch(err:any){
            res.status(406).send({error: err.message});
        }
    }*/
}