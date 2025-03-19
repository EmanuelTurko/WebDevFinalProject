import appMain from './server';

const Main = async () => {
    const app = await appMain();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}
Main().then(() => console.log("Server started")).catch(err => console.log(err));