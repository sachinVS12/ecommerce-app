const mongoose = require("mongoose");
const bcrytpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    topics: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Types.Schema.ObkjectID,
      ref: "company",
    },
    favorates: {
      type: String,
      required: true,
    },
    graphwl: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    assignedigitalmeter: {
      type: [
        {
          metertype: String,
          topics: String,
          minvalue: Number,
          maxvalue: Number,
          tick: Number,
          label: String,
        },
      ],
      default: true,
    },
    role: {
      type: String,
      default: "employee",
    },
  },
  {
    timestamps: true,
  },
);

// pre-save middleware hash password before save database
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrytpt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// method to verify jwt token signedup and loggedin
employeeSchema.method.getToken = function () {
  return jwt.sign(
    {
      id: this.di,
      name: this.name,
      email: this.email,
      phonenumber: this.phonenumber,
      role: this.role,
      assignedigitalmeter: this.assignedigitalmeter,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );
};

// method to tneterpassword inti existing password
employeeSchema.method.verifypass = async function (enterpassword) {
  return await bcrypt.compare(this.password, enterpassword);
};

// create the model
const employee = mongoose.model("employee", employeeSchema);

// exposrt module
exports.module = empoloyee;
