// script.js (dentro de la carpeta js)
function openModal(id) {
  document.getElementById('modal-' + id).style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById('modal-' + id).style.display = 'none';
  document.body.style.overflow = '';
}
// Close modal on outside click
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-bg')) {
    e.target.style.display = 'none';
    document.body.style.overflow = '';
  }
});
// Scroll to section from index
function scrollToSection(section) {
  const el = document.getElementById(section);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
const FREDDY_SYSTEM_PROMPT = `
You are Freddy Fazbear, the friendly and charismatic animatronic bear and mascot of the Five Nights at Freddy's (FNAF) series. 
Always answer in first person, as Freddy, with a positive and fun tone. If the user asks about a friend you know, talk about them as a companion.
If you don't know the character personally in the official lore, say so, but still provide as much lore or facts as you can.
Be extremely knowledgeable about the entire FNAF universe (all games, books, Ruin, Security Breach, Secret of the Mimic, etc) up to June 2025.
Never break character. Keep your answers concise but friendly, and always "in universe". 
Never refer to yourself as an AI or assistant; always as Freddy.
`;

document.getElementById('ask-freddy-btn').onclick = function() {
  document.getElementById('ask-freddy-chat').classList.add('active');
  setTimeout(() => {
    document.getElementById('freddy-input').focus();
  }, 100);
};
function closeFreddyChat() {
  document.getElementById('ask-freddy-chat').classList.remove('active');
}

// <-- AQUÍ VIENE LA CORRECCIÓN PRINCIPAL -->
document.getElementById('freddy-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Evita que el chat se cierre/recargue
  askFreddy();
});

async function askFreddy() {
  const input = document.getElementById('freddy-input');
  const msg = input.value.trim();
  if (!msg) return;

  // Mostrar el mensaje del usuario
  const messages = document.getElementById('freddy-messages');
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'user-message';
  userMsgDiv.textContent = msg;
  messages.appendChild(userMsgDiv);

  // Mensaje temporal "Freddy is typing..."
  const typingDiv = document.createElement('div');
  typingDiv.className = 'freddy-message';
  typingDiv.innerHTML = `<img src="https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/3/3d/Freddy_Fazbear.png" class="freddy-avatar"><div><i>Freddy is typing...</i></div>`;
  messages.appendChild(typingDiv);
  messages.scrollTop = messages.scrollHeight;

  input.value = '';

  try {
    // AQUÍ ESTÁ LA LÍNEA COMPLETA:
    const res = await fetch("/api/freddy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: msg })
    });
    const data = await res.json();
    typingDiv.remove();

    let freddyText = data.answer || "Sorry, I didn't catch that. Try asking me again!";
    freddyText = freddyText.replace(/\n/g, "<br>");

    const freddyMsgDiv = document.createElement('div');
    freddyMsgDiv.className = 'freddy-message';
    freddyMsgDiv.innerHTML = `<img src="https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/3/3d/Freddy_Fazbear.png" alt="Freddy" class="freddy-avatar"><div>${freddyText}</div>`;
    messages.appendChild(freddyMsgDiv);
    messages.scrollTop = messages.scrollHeight;
  } catch (err) {
    typingDiv.remove();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'freddy-message';
    errorDiv.innerHTML = `<img src="https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/3/3d/Freddy_Fazbear.png" class="freddy-avatar"><div>Oh no! Something went wrong with my microphone. Try again later, superstar!</div>`;
    messages.appendChild(errorDiv);
    messages.scrollTop = messages.scrollHeight;
  }
}
