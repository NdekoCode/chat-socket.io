import { Server } from "socket.io";
import app from "./app.js";
import { createServer } from "http";

const PORT = process.env.PORT || 3500;
const server = createServer(app);
// On instancie socket.io et il va prendre HTTP comme paramètre d'instanciation
const io = new Server(server, () => {
  console.log("Socket is running");
});
// On ecoute l'evenement "connexion" de socket.io sur notre serveur, on  va pouvoir se connecter depuis partie front-end
io.on("connection", (socket) => {
  // On se connecte au socket
  console.log("Une connection s'active");
  // console.log(socket.id); // socket: Va contenir les information de la connection
  // id: pour chercher l'identifiant du socket
  // On doit aussi ecouter la deconnection au socket
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecter"); // Sera appeler quand l'utilisateur va quitter sa page ou va l'actualiser
  });
  // On ecoute quand on quite la salle
  socket.on("leave_room", (dataRoom) => {
    console.log(dataRoom.user + " leave room " + dataRoom.room);
  });
  // On ecoute quand on entre dans une nouvelle salle
  socket.on("enter_room", (roomData) => {
    socket.join(roomData);
    console.log(socket.rooms);
  });

  // On gère le tchat en mettant un evenement qu'on veut par exemple on('chat')
  socket.on("chat_message", (message) => {
    io.emit("received_message", message);
  });
});
server.listen(PORT, () => {
  console.log("Port is listening at " + PORT);
});
