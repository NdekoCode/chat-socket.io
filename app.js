import express from "express";
import { join } from "path";
import ejsLayout from "express-ejs-layouts";
import { syncDB } from "./config/database.js";
import { __dirname } from "./utils/utils.js";
syncDB();
const app = express();
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.set("layout", "./layouts/layout");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));

app.use(ejsLayout);
app.get("/", (req, res, next) => {
  res.render("pages/index", { pageTitle: "Home page" });
});
export default app;
