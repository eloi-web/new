const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');

    const quickReplies = {
      "How do I post a job?": "To post a job, go to the 'main' page, on top you'll see the feed where you can 'Post Job' or anything else related to it, then fill in the required fields like description and image.",
      "Show me running an auctions?": "To see ongoing auctions, head to 'Auctions' page, and there you will find currently running auctions, so if you need to post your own head over to 'main' page",
      "Show me available tenders": "Visit the 'Tenders' page to browse current opportunities",
      "I need a consultant": "To find a consultant, use the 'Consultancy' page where you can search, contact, or post a request."
    };

    function toggleTheme() {
      document.body.classList.toggle("dark");
    }

    function addMessage(text, type) {
      const msg = document.createElement('div');
      msg.className = `message ${type}`;
      msg.innerHTML = text;
      chatBox.appendChild(msg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function sendMessage() {
      const text = userInput.value.trim();
      if (!text) return;
      addMessage(text, 'user');
      userInput.value = '';
      fetchResponseFromAI(text);
    }

    function quickReply(text) {
      addMessage(text, 'user');
      const response = quickReplies[text];
      if (response) {
        setTimeout(() => addMessage(response, 'bot'), 600);
      } else {
        fetchResponseFromAI(text);
      }
    }

    async function fetchResponseFromAI(prompt) {
      const dots = `<div class="message bot typing-dots"><span></span><span></span><span></span></div>`;
      chatBox.insertAdjacentHTML('beforeend', dots);
      chatBox.scrollTop = chatBox.scrollHeight;

      const res = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      });

      const data = await res.json();
      const text = data.generated_text || (data[0]?.generated_text) || "I'm not sure how to respond to that.";

      const lastDots = chatBox.querySelector('.typing-dots');
      if (lastDots) lastDots.remove();

      addMessage(text, 'bot');
    }