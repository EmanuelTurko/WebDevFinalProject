import appMain from './server';
import https from "https"
import fs from "fs"


const Main = async () => {
    const app = await appMain();
    const PORT = process.env.PORT || 3000;
    if(process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } else{
        const prop = {
            key: fs.readFileSync("./client-key.pem"),
            cert: fs.readFileSync("./client-cert.pem")
        }
        https.createServer(prop,app).listen(PORT)
    }
}
Main().then(() => console.log("Server started")).catch(err => console.log(err));