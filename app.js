import express from "express";
import ejsLayout from "express-ejs-layouts";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
