// controllers/UserController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user.user_id, roleId: user.role_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log("User registered:", {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error during registration", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user.user_id, roleId: user.role_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log("User logged in:", {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });
    res.json({ message: "User logged in successfully", token });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ error: "Login failed" });
  }
};
