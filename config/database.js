import ChatMDL from "../models/ChatMDL.js";
export function syncDB() {
  ChatMDL.sync();
}
