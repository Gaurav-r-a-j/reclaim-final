 import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import userRoutes from "../src/routes/users";
import notesRoute from "../src/routes/notes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv"
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";
import cors from "cors";

const app = express();


app.use(morgan("dev"));
app.use(cors());

// app.use(cors<Request>());
// Enable CORS for all routes
app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:5174", // Replace with your frontend origin
//     credentials: true, // Enable credentials (cookies, authorization headers)
//   })
// );

app.use(express.json());

// it is necessary to configure sessions  before routes and after we read json body

// app.use( session({
//     secret:env.SESSION_SECRET,
//     resave:false,
//     saveUninitialized:false,
//     cookie:{
//         maxAge:60*60*1000
//     },
//     rolling:true,
//     store: MongoStore.create({
//         mongoUrl:env.MONGO_CONNECTION_STRING
//     }),
// }))

app.use("/api/users",userRoutes);

app.use("/api/notes",notesRoute);

app.use((req,res,next)=>{
    next(createHttpError(404,"End Point Not Found "));
 });

app.use((error: unknown,req: Request , res: Response , next: NextFunction)=>{
   
        console.error(error);
        let errorMesssage = "An unknown error occured";
        let statusCode = 500;
        if (isHttpError(error)) {
            statusCode = error.status;
            errorMesssage = error.message;
        }
        res.status(statusCode).json({error : errorMesssage})


});


export default app;

