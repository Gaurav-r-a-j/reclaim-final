import mongoose from "mongoose";
// import env from "./util/validateEnv";
import app from "./app";




const port = process.env.PORT;



mongoose.connect(process.env.MONGO_CONNECTION_STRING!)
    .then(() => {
        console.log("Mongoose Connected");

        app.listen(port, () => {
            console.log("server is running on port: " + port);
        });
    }).catch(console.error);