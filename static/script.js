async function sendMessage() {
    const input = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    // Show user's message
    chatBox.innerHTML += `
        <div class="user-message">
            <b>You:</b> ${message}
        </div>
    `;

    input.value = "";

    // Show Typing animation
    chatBox.innerHTML += `
        <div class="bot-message" id="typing">
            <b>Bot:</b> Typing<span class="dots">...</span>
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        // Remove Typing message
        const typing = document.getElementById("typing");
        if (typing) {
            typing.remove();
        }

        // Show bot response
        chatBox.innerHTML += `
            <div class="bot-message">
                <b>Bot:</b> ${data.reply}
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.log(error);

        const typing = document.getElementById("typing");
        if (typing) {
            typing.remove();
        }

        chatBox.innerHTML += `
            <div class="bot-message">
                <b>Bot:</b> Server connection error.
            </div>
        `;
    }
}

function handleKey(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
