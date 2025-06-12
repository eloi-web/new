function openChat() {
  document.getElementById('chatSidebar').classList.add('open');
}

function closeChat() {
  document.getElementById('chatSidebar').classList.remove('open');
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  if (!text) return;

  const messageEl = document.createElement('div');
  messageEl.className = 'message outgoing';
  messageEl.innerHTML = `<p>${text}</p>`;

  document.getElementById('chatMessages').appendChild(messageEl);
  input.value = "";

  setTimeout(() => {
    const reply = document.createElement('div');
    reply.className = 'message incoming';
    reply.innerHTML = `<p>not available now!</p>`;
    document.getElementById('chatMessages').appendChild(reply);
  }, 1000);
}
