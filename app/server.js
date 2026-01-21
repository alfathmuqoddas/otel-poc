import express from "express";
import winston from "winston";

// Just use a standard pino logger.
// The OTel Auto-Instrumentation will intercept these logs
// IF the instrumentation.js is loaded correctly.
const logger = winston.createLogger();

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  logger.info({ path: req.url }, "Handling request at root");
  res.send({ status: "success", message: "Hello from Instrumented Node.js!" });
});

app.get("/error", (req, res) => {
  logger.error("Something went wrong on this route!");
  res.status(500).send({ error: "Internal Server Error" });
});

app.listen(port, () => {
  // console.log(`App listening at http://localhost:${port}`);
  logger.info(`Server started on port ${port}`);
});
