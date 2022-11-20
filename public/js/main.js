// On se connecte au serveur socket
const socket = io(); // Vient du fichier socket.io.js

// On gère l'arriver d'un nouvel utilisateur et pour ça on utilise l'evenement on('connect') de socket.io
socket.on("connect", () => {
  console.log("Connexion front");
  // Le message va contenir le nom de la sale et de l'utilisateur
  socket.emit("enter_room", {
    room: document.querySelector("#submenu li.active").dataset.room,
    user: "ndekocode",
  });
});
window.addEventListener("DOMContentLoaded", function () {
  const name = document.querySelector("#name");
  const message = document.querySelector("#message");
  const form = document.querySelector(".form");
  const msg = document.querySelector("#msg");
  const writing = document.querySelector("#writing");
  // Le nom de la salle et la date du message
  let room = document.querySelector("#submenu li.active").dataset.room;
  const createdAt = new Date();
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
    room = actifTab.dataset.room;
    console.log("Message envoyer");
    // On envois le message vers tous les utilisateur connecter
    // Une fois que l'on a recuperer les message on va les envoyer au serveur socket en emmettant notre evenement personnaliser "chat"
    socket.emit("send_message", {
      name: name.value,
      message: message.value,
      createdAt,
      room,
    });
    writing.classList.add("hidden");
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
        if (actifTab !== null) {
          actifTab.classList.remove("active");
        }
        this.classList.add("active");
        msg.innerHTML = "";

        // LOGIQUE FRONT: ON QUITTE D'ABORD UNE SALLE POUR REJOINDRE UNE AUTRE SALLE
        // On quite l'ancienne salle, pour ne pas etre dans plusieurs salle en meme temps
        socket.emit("leave_room", {
          room: actifTab.dataset.room,
          user: name.value ? name.value : "ndekocode",
        });
        socket.emit("enter_room", {
          room: this.dataset.room,
          user: name.value ? name.value : "ndekocode",
        });
        // On entre dans la nouvelle salle
        console.log(this.dataset.room);
      }
    });
  });

  function loadHTMLData(msg) {
    let createdAt = new Date(msg.createdAt);

    const texte = `<div>

    <small class="block text-center p-1 rounded-md bg-gray-400">${createdAt.toLocaleDateString()}</small>
      <div class="flex items-center my-5 m-3">
        <span class="p-2 w-16 h-16 mx-1 flex items-center mb-5 rounded-full border border-gray-300 text-center">${
          msg.name
        }</span>
        <p class="p-2 rounded-lg bg-blue-800 text-white">${msg.message}</p>
      </div>
      </div>
    </div>`;
    const msgContainer = document.querySelector("#msg");
    msgContainer.innerHTML += texte;
  }
  // On ecoute l'evenement "init message"
  socket.on("init_message", (data) => {
    const initMessage = JSON.parse(data.messages);
    console.log(data);
    for (let msg of initMessage) {
      loadHTMLData(msg);
    }
  });
  console.log(message);
  message.addEventListener("input", (evt) => {
    const room = document.querySelector("#submenu li.active").dataset.room;
    const name = document.querySelector("#name").value;
    console.log(name);
    socket.emit("typing", { user: name, room: room });
  });
  // ON ecoute les messages indiquant que quelqu'un tape au clavier
  socket.on("usertyping", (data) => {
    console.log("On tape");
    writing.classList.remove("hidden");
    writing.classList.add("block");
    console.log(writing);
    writing.innerHTML = `${data.user} est entrer d'ecrire data ${data.room}`;
    this.setTimeout(() => {
      writing.classList.add("hidden");
    }, 3500);
  });
});
