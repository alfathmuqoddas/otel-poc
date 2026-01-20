import express from "express";
import pino from "pino";

const logger = pino(
  pino.transport({
    target: "pino-opentelemetry-transport",
  }),
);

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
  console.log(`App listening at http://localhost:${port}`);
  logger.info(`Server started on port ${port}`);
});
