import appMain from './server';

const Main = async () => {
    const app = await appMain();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

Main().then(() => console.log("Server started")).catch(err => console.log(err));


//TODO 1: Initialize the app ✅
//TODO 2: Controller,Model,Route for Posts And Comments ✅
//TODO 3: User model and Authentication ✅
//TODO 4: Tests for Posts,Comments and Auth using Jest
//TODO 5: Swagger Documentation
//TODO 6: Frontend