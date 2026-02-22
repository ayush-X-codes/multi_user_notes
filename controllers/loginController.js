const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserFromDB } = require("../models/userModel");

function loginForm(req, res) {
  res.render("loginForm");
}

async function loginUser(req, res) {
  console.log("request comes")
  const { username, email, password } = req.body;
  console.log(username, email, password)
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password mush be at least 6 character" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const user = await getUserFromDB(email);
    console.log("user is:", user)

    const isValid = await bcrypt.compare(password, user.hash_password);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Login successfull" });
  } catch (error) {
    console.error("Log in failed: ", error);
    return res
      .status(500)
      .json({ error: "Failed to login. Please try again." });
  }
}

module.exports = { loginForm, loginUser };
