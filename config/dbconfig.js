// On charge sequelize
import { Sequelize } from "sequelize";
import { __dirname } from "../utils/utils.js";
import { join, dirname } from "path";

const dbPath = join(dirname(__dirname), "data", "chat.sqlite");
// On fabrique le lien de la base de donnée
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: dbPath,
});
export default sequelize;
