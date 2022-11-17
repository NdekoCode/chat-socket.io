// On se connecte au serveur socket
const socket = io(); // Vient du fichier socket.io.js
window.addEventListener("DOMContentLoaded", function () {
  const name = document.querySelector("#name");
  const message = document.querySelector("#message");
  const form = document.querySelector(".form");
  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    console.log("Message envoyer");
    // On envois le message vers tous les utilisateur connecter
    // Une fois que l'on a recuperer les message on va les envoyer au serveur socket en emmettant notre evenement personnaliser "chat"
    socket.emit("chat_message", {
      name: name.value,
      message: message.value,
    });
    name.value = "";
    message.value = "";
  });
  // On ecoute l'evenement "chat message"
  socket.on("received_message", (data) => {
    console.log(data);
    const p = document.createElement("p");
    p.className = "flex items-center my-5";
    p.innerHTML = `<span class="p-2 w-16 h-16 mx-1 mb-5 rounded-full border border-gray-300 text-center">${data.name}</span> <p class="p-2 rounded-lg bg-blue-800 text-white">${data.message}</p>`;
    const msg = document.querySelector("#msg");
    msg.appendChild(p);
  });
});
