import appMain from './server';

const Main = async () => {
    const app = await appMain();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

Main().then(() => console.log("Server started")).catch(err => console.log(err));


//TODO 1: Initialize the app ✅
//TODO 2: Controller,Model,Route for Posts And Comments ✅
//TODO 3: User model and Authentication ✅
//TODO 4: Tests for Posts,Comments and Auth using Jest ✅
//TODO 5: Swagger Documentation ✅❌ - comments need work
//TODO 6: Frontend