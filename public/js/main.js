// On se connecte au serveur socket
const socket = io(); // Vient du fichier socket.io.js

// On gère l'arriver d'un nouvel utilisateur et pour ça on utilise l'evenement on('connect') de socket.io
socket.on("connect", () => {
  // Le message va contenir le nom de la sale et de l'utilisateur
  socket.emit("enter_room", { room: "", user: "ndekocode" });
});
window.addEventListener("DOMContentLoaded", function () {
  const name = document.querySelector("#name");
  const message = document.querySelector("#message");
  const form = document.querySelector(".form");
  function dropdown() {
    document.querySelector("#submenu").classList.toggle("hidden");
    document.querySelector("#arrow").classList.toggle("rotate-0");
  }
  dropdown();

  function openSidebar() {
    document.querySelector(".sidebar").classList.toggle("hidden");
  }
  document.querySelector(".drop").addEventListener("click", dropdown);
  this.document
    .querySelector(".span-pointer")
    .addEventListener("click", openSidebar);
  this.document
    .querySelector(".icon-pointer")
    .addEventListener("click", openSidebar);
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
    p.className = "flex items-center my-5 m-3";
    p.innerHTML = `<span class="p-2 w-16 h-16 mx-1 flex items-center mb-5 rounded-full border border-gray-300 text-center">${data.name}</span> <p class="p-2 rounded-lg bg-blue-800 text-white">${data.message}</p>`;
    const msg = document.querySelector("#msg");
    msg.appendChild(p);
  });
});
