import app from "./app.js";
import { createServer } from "http";

const PORT = process.env.PORT || 3500;
const server = createServer(app);
server.listen(PORT, () => {
  console.log("Port is listening at " + PORT);
});
