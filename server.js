const express = require("express");
const cookieParser = require("cookie-parser");
const registerRouter = require("./routes/registerRouter");
const loginRouter = require("./routes/loginRouter");
const notesRouter = require("./routes/notesRouter");
const adminRouter = require("./routes/adminRouter");
const path = require("path");
const { requireAuth } = require("./middleware/requireAuth");
const { requireRole } = require("./middleware/requireRole");
require("dotenv").config()
const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/register", registerRouter);
app.use("/login", loginRouter);

app.use("/admin/notes", requireAuth, requireRole, adminRouter);
app.use("/", requireAuth, notesRouter);

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
