import express from "express";
import { join } from "path";
import ejsLayout from "express-ejs-layouts";
import { syncDB } from "./config/database.js";
import { __dirname } from "./utils/utils.js";
syncDB();
const app = express();
app.set("view engine", "ejs"); // On utilise le moteur de template EJS
app.set("views", join(__dirname, "views")); // On definit le dossier des nos fichiers HTML
app.set("layout", "./layouts/layout"); // On définis le fichier du layout pour le rendus HTML
app.use(ejsLayout); // On active le layout
app.use(express.json()); // On dit que le corps de la requete nous renvera que du JSON
app.use(express.urlencoded({ extended: false })); // Tous les donner passer dans l'URL seront encoder en format JSON
app.use(express.static(join(__dirname, "public"))); // On configure le dossier qui va contenir nos fichiers static càd CSS/JS/IMAGES

app.get("/", (req, res, next) => {
  res.render("pages/index", { pageTitle: "Home page" });
});
// ON EXPORT LE APP Pour l'utiliser coté serveur
export default app;
