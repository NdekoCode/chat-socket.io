import { define, sequelize } from "../config/dbconfig.js";
import { Sequelize } from "sequelize";
const ChatMDL = sequelize.define("chat", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  room: {
    type: Sequelize.STRING,
  },
});
export default ChatMDL;
