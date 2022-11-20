import { Server } from "socket.io"; // On importe le serveur de socket.io
import app from "./app.js"; // On importe App
import { createServer } from "http"; // On importe la fonction de creation du serveur de node.js
import ChatMDL from "./models/ChatMDL.js";

const PORT = process.env.PORT || 3500;
const nodeServer = createServer(app); // On créer notre serveur node.js
// On instancie un serveur socket.io et il va prendre le serveur nodejs comme paramètre d'instanciation
const io = new Server(nodeServer, () => {
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
  // On ecoute quand on entre dans une nouvelle salle
  socket.on("enter_room", (roomData) => {
    socket.join(roomData.room); // Pour rejoindre une salle
    console.log("vient de rejoindre", socket.rooms, roomData); // Socket.rooms: c'est la liste des salles et à l'interieur on aura une clé pour chaque
    console.log(roomData.room);
    ChatMDL.findAll({
      where: {
        room: roomData.room,
      },
    })
      .then((list) => {
        socket.emit("init_message", { messages: JSON.stringify(list) });
      })
      .catch((err) => {
        console.log("Error lors de la recupération des messages");
      });
  });

  // On ecoute quand on quite une salle
  socket.on("leave_room", (dataRoom) => {
    socket.leave(dataRoom.room); // Pour quitter une salle
    console.log(dataRoom.user + " leave room " + dataRoom.room);
  });
  // On gère le tchat en mettant un evenement qu'on veut par exemple on('chat')
  socket.on("send_message", (message) => {
    // On créer une entrer dans la base de donnée à fin de separer les differentes salle
    ChatMDL.create({
      name: message.name,
      message: message.message,
      room: message.room,
      createdAt: message.createdAt,
    })
      .then(() => {
        console.log("Message envoyer");
        // Le message est stocké en base de donné on le rélait à tous les utilisaeurs dans le salon correspondant, càd seul les utilisateur qui sont dans la salle message.room pourront voir ces message, il faut qu'il soit dans la meme salle
        io.in(message.room).emit("received_message", message);
        // On envoyait le message à tous les utilisateurs connecter
        // io.emit("received_message", message);
      })
      .catch((err) => {
        console.log("error lors le l'envois du message");
      });
  });
  // On ecoute les messages typing: càd quand l'utilisateur est entrer d'ecrir
  socket.on("typing", (data) => {
    console.log(`${data.user} est entrer d'ecrire dans ${data.room} ...`);
    socket.to(data.room).emit("usertyping", data); // On envoie un evenement uniquement à tous les gens qui sont dans le meme salon
  });
});
nodeServer.listen(PORT, () => {
  console.log("Port is listening at http://localhost:" + PORT);
});
