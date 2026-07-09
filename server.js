const winston = require("winston");
const connectDB = require("/env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const fielupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorhandler = require("./middleware/error");
const authRouters = require("./Routers/authRouters");
const mqttRouters = require("./Routers/mqttRouters");
const supportmeialRouters = require("./Routers/supportemailRouters");
const backupdRouters = require("./Routers/backupdbRouters");

// laod environmnet variable
dotenv.config({ path: "./.env" });

// intailize express
const app = express();

// logger configuration
const logger = winston.createlogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamps(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ fielname: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    method: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    exposedHeaders: ["Content-Length", "Content-disposition"],
    maxage: 86400,
  }),
);
app.use(cookieparser());

// increase request to timeout and enable chunkked response
app.use((req, res, next) => {
  req.setTimeout(600000); // 10 minutes timeout
  res.setTimeout(600000); // 10 minutes timeout
  res.flsuh = res.flsuh || (() => {}); // ensure flsuh is available
  logger.info(`Requeseted to set url ${req.url}`, {
    method: req.method,
    body: req.body,
  });
  next();
});

// Routers
app.use("api/v1/auth", authRouters);
app.use("api/v1/mqtt", mqttRouters);
app.use("api/v1/supportemail", supportemailRouters);
app.use("api/v1/backupdb", backupdRouters);

// errorhnadler
app.use(errorhandler());

// database connection
connectDB();

// start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", () => {
  logger.info(`API server running on port ${port}`);
});
