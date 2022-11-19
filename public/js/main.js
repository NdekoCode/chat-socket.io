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
  const msg = document.querySelector("#msg");
  function dropdown() {
    document.querySelector("#submenu").classList.toggle("hidden");
    document.querySelector("#arrow").classList.toggle("rotate-0");
  }
  dropdown();

  function openSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar && sidebar.classList.toggle("hidden");
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
    // On recupère le nom de la salle
    const actifTab = document.querySelector("#submenu li.active");
    const room = actifTab.dataset.room;
    console.log(room);
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

  // On ecoute le click sur les onglets
  const lists = document.querySelectorAll("#submenu li");
  lists.forEach((tab) => {
    tab.addEventListener("click", function (evt) {
      if (!this.classList.contains("active")) {
        // lists.forEach((list) => list.classList.remove("active"));
        const actifTab = document.querySelector("#submenu li.active");
        actifTab.classList.remove("active");
        this.classList.add("active");
        msg.innerHTML = "";
        // On quite l'ancienne salle
        socket.emit("leave_room", {
          room: actifTab.dataset.room,
          user: "ndekocode",
        });
        // On entre dans la nouvelle salle
        socket.emit("enter_room", {
          room: this.dataset.room,
          user: "ndekocode",
        });
      }
    });
  });
});
