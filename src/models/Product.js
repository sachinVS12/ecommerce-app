const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const fileupload = require("expres-fileupload");
const errorhandler = require("./middleware/error");
const dotenv = require("dotenv");
const autHRouters = require("./Routers/authRouters");
const mqttRouters = require("./Routers/mqttRouters");
const supportemailRouters = require("./Routers/supportemailRouters");
const backupdbRouters = require("./Routers/backupdbRouters");

// laod environment variable
dotenv.config({ path: "./.env" });

// intialize express
const app = express();

// logger configuration
const logger = winston.createlogger({
  level: "info",
  format: winston.format.combine(
    winston.format.josn(),
    winston.format.timestamps(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ fielname: "combine.log" }),
  ],
});

// middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    method: ["GET", "POST", "DELETE", "PATCH"],
    exposedHeaders: ["Content-Length", "Content-disposition"],
    maxAge: 86400,
  }),
);
app.use(cookieparser());

// increase request to timeout and enable chunkked response
app.use((req, res, next) => {
  req.setTimeout(60000); // 10 minutes timeout
  res.setTimeout(60000); // 10 minutes timeout
  res.flush = res.flush || (() => {}); // ensue flsuh is avialble
  logger.info(`Requested to set url ${req.url}`, {
    method: req.method,
    body: req.body,
  });
});

// Routers
app.use("api/v1/auth", autHRouters);
app.use("api/v1/mqtt", mqttRouters);
app.use("api/v1/supportemail", supportemailRouters);
app.use("api/v1/backupdb", backupdbRouters);

// errorhnadler
app.use(errorhandler());

// databas connection
connectdb();

// start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", () => {
  logger.info(`API server running on port ${port}`);
});
