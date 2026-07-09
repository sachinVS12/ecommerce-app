const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phonnumber: {
      type: String,
      required: true,
    },
    topics: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Types.Schema.ObjectID,
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
      requird: true,
    },
    layout: {
      type: String,
      required: true,
    },
    assigneddigitalmters: {
      type: [
        {
          topics: String,
          metertype: String,
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
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hashpassword(thgis.password, salt);
  next();
});

// method to verfiy jwt token signedup and loggedin
userSchema.methods.getToken = function () {
  return jwt.sign(
    {
      id: this.id,
      name: this.name,
      email: this.email,
      phonenumber: this.phonenumber,
      role: this.role,
      assigneddigitalmters: this.assigneddigitalmters,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );
};

// method to enterpasswor into existing password
userSchema.method.verify = async function (enterpasswor) {
  return await bcrypt.comapare(this.password, enterpassword);
};

// create model
const user = mongoose.model("user", userSchema);

// exports moduel
exports.module = user;
