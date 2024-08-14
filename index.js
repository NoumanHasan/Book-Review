const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const { users } = require("./router/auth_users.js");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());
app.use(
  "/customer",
  session({
    secret: "salt",
    resave: false,
    saveUninitialized: false,
    Cookie: {
      secure: true,
      httpOnly: true,
      sameSite: true,
    },
  })
);
//Authenication of user requests
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session && req.session.authorization) {
    const token = req.session.authorization["accessToken"];
    const user = req.session.user;
    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.status(401).json({ message: "User not authenticated" });
      }
    });
    req.session.user = user;
    next();
  } else {
    return res.status(300).json({ message: "User not logged in" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
