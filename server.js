import express from "express";
import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { authRouter } from "./app/Routes/index.js";
env.config();
const { PORT, NODE_ENV } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  const { url, method, body } = req;
  if (url.match("/auth")) {
    console.log(
      `[ METHOD: ${method}  ROUTE: ${url} at ${new Date().toLocaleString()} ]`
    );
  }
  NODE_ENV === "development" &&
    method !== "GET" &&
    console.log("PAYLOAD: ", body);
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ status: 0, message: "Caught into some issue" });
});
app.use("/auth", authRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "./dist")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist", "index.html"));
});
app.get("/", (req, res) => {
  res.send(`Ecommerce Backend`);
});
app.listen(PORT, () =>
  console.log([
    { status: `APP STARTED ON PORT ${PORT} AT ${new Date().toLocaleString()}` },
  ])
);
