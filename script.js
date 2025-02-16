const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

const OPENAI_API_KEY = "your-api-key-here"; // Replace with your OpenAI API key
const API_URL = "https://api.openai.com/v1/chat/completions";

async function sendMessage() {
    let message = userInput.value.trim();
    if (message === "") return;

    appendMessage("user", message);
    userInput.value = "";

    // Show "typing..." indicator
    appendMessage("bot", "Thinking...");

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "You are an eco-friendly chatbot helping users with sustainability tips." },
                           { role: "user", content: message }]
            })
        });

        let data = await response.json();
        let botReply = data.choices[0].message.content;

        // Remove "thinking..." message
        removeLastBotMessage();

        appendMessage("bot", botReply);
    } catch (error) {
        console.error("Error:", error);
        removeLastBotMessage();
        appendMessage("bot", "Sorry, I couldn't fetch a response. Please try again.");
    }
}

function appendMessage(sender, text) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLastBotMessage() {
    let messages = document.querySelectorAll(".bot-message");
    if (messages.length > 0) {
        messages[messages.length - 1].remove();
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
