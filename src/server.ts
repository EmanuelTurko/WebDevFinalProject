import express,{Express} from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
dotenv.config();
import postsRoutes from './routes/post_route';
import commentRoutes from './routes/comment_route';
import authRoutes from './routes/auth_route';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/posts', postsRoutes);
app.use('/posts/:postId/comments', commentRoutes);
app.use('/auth', authRoutes);

const appMain = async()=> {
    return new Promise<Express>((resolve, reject) => {
        const db = mongoose.connection;
        db.on("error",(err) =>{
            console.error(err);
        });
        db.once("open",() => {
            console.log("connected to DB");
        });
    if(process.env.DB_CONNECT === undefined) {
        console.error("Please set the DB_CONNECT environment variable");
        reject();
    } else {
    mongoose.connect(process.env.DB_CONNECT).then(() => {
        console.log("appMain finish");
    });
    resolve(app);
    }
    });
};

export default appMain;
