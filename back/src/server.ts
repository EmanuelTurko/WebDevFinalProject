import express, {Express} from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
dotenv.config();
import postsRoutes from './routes/post_route';
import commentRoutes from './routes/comment_route';
import authRoutes from './routes/auth_route';
import fileRoutes from './routes/file_route';
import userRoutes from './routes/user_route';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { getRecipeOfTheDay } from './AiPromptService';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
}));



    const options ={
        definition:{
            openapi:"3.0.0",
            info:{
                title:"Web Dev 2024 REST API",
                version:"1.0.0",
                description:"REST server including authentication using JWT",
            },
            servers:[
                {url:"http://"+process.env.DOMAIN_BASE},
                {url:"localhost:"+process.env.PORT},
                {url:"https:"+process.env.DOMAIN_BASE}],
    },
    apis:["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs));


app.use('/posts', postsRoutes);
app.use('/posts/:postId/comments', commentRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/',express.static('public'));
app.use('/file/', fileRoutes);

app.get('/api/recipe', async (req, res) => {
    try {
        const recipe = await getRecipeOfTheDay();
        res.status(200).json({ recipe });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});

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
