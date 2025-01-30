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


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next();
});

if(process.env.NODE_ENV === 'development'){
    const options ={
        definition:{
            openapi:"3.0.0",
            info:{
                title:"Web Dev 2024 REST API",
                version:"1.0.0",
                description:"REST server including authentication using JWT",
            },
            servers:[{url:"http://localhost:"+process.env.PORT}],
    },
    apis:["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs));
    console.log("Swagger route registered at /api-docs");
}


app.use('/posts', postsRoutes);
app.use('/posts/:postId/comments', commentRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/public/',express.static('public'));
app.use('/file/', fileRoutes);

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
