import express from "express";
import dotenv from "dotenv";
import connectioDB from "./src/utils/connectionDB";
import globalErrorHandlerMdlwr from "./src/middlewars/globalErrorHandler.middleware";
import mountRoutes from "./src/mounts";
import morgan from "morgan";
import cors from "cors";
dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || 8000;
app.use(morgan("tiny"));
app.use(express.json());
app.use(
  cors({
    origin: "https://exclusive-git-main-ahmedmohamedshalaby.vercel.app",
  })
);
app.use("/api/v1", mountRoutes);

app.use(globalErrorHandlerMdlwr);

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

connectioDB();

process.on("unhandledRejection", (err) => {
  console.log(`Un hanlded rejection errors ${err}`);
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});
