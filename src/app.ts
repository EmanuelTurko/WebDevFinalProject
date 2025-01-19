import appMain from './server';

const Main = async () => {
    const app = await appMain();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

Main().then(() => console.log("Server started")).catch(err => console.log(err));