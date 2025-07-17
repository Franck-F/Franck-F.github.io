document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const webhookUrl = "https://jeytobermories.app.n8n.cloud/webhook-test/b26a67cf-793b-4fcd-a20a-06c5a4392c20";

    function addMessage(text, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", `${sender}-message`);
        messageElement.textContent = text;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === "") return;

        addMessage(messageText, "user");
        userInput.value = "";

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Assumes n8n returns a JSON object with a "reply" field.
            // Example n8n "Respond to Webhook" node: {"reply": "This is the bot answer"}
            const botReply = data.reply || "Désolé, je n'ai pas compris.";
            addMessage(botReply, "bot");

        } catch (error) {
            console.error("Error sending message to webhook:", error);
            addMessage("Erreur de connexion au serveur.", "bot");
        }
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});