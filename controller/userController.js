const users = require('../Models/UserModel.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 📅 function to get current date in DD/MM/YYYY
function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

exports.registerUser = async (req, res) => {
  try {
    const { username, email, phone, profile, role, password } = req.body;

    const emailExists = await users.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const phoneExists = await users.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📅 auto registration date
    const regdate = getCurrentDate();

    const newUser = new users({
      username,
      email,
      phone,
      profile,
      role: role || "user",
      password: hashedPassword,
      regdate,
      status: "active"
    }); 

    await newUser.save();

    // remove password before sending response
    const { password: pwd, ...userWithoutPassword } = newUser._doc;

    res.status(201).json({
      message: "Registration successful",
      user: userWithoutPassword
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ check user exists
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Email is not registered" });
    }

    // 2️⃣ compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password mismatch" });
    }

    // 3️⃣ generate JWT token
    const token = jwt.sign(
      {
        userId: existingUser._id,
        userMail: existingUser.email,
        role: existingUser.role
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    // 4️⃣ remove password before sending response
    const { password: pwd, ...userWithoutPassword } = existingUser._doc;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.googleLogin = async (req, res) => {
  try {
    const { email, username, profile } = req.body;


    // 1️⃣ check if user already exists
    let existingUser = await users.findOne({ email });

    // ✅ USER EXISTS → LOGIN
    if (existingUser) {
      const token = jwt.sign(
        {
          userId: existingUser._id,
          userMail: existingUser.email,
          role: existingUser.role
        },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );

      const { password, ...userWithoutPassword } = existingUser._doc;

      return res.status(200).json({
        message: "Google login successful",
        token,
        user: userWithoutPassword
      });
    }

    // ❌ NEW USER → REGISTER FIRST

    // default values for google users
    const phone = "0000000000";
    const role = "user";
    const randomPassword = "googleUser123";

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // 📅 current date function (reuse from register)
    const today = new Date();
    const regdate = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;

    const newUser = new users({
      username,
      email,
      phone,
      profile,
      role,
      password: hashedPassword,
      regdate,
      status: "active"
    });

    await newUser.save();

    // create token for new user
    const token = jwt.sign(
      {
        userId: newUser._id,
        userMail: newUser.email,
        role: newUser.role
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    const { password, ...userWithoutPassword } = newUser._doc;

    res.status(201).json({
      message: "Google registration successful",
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};