

// Get references to HTML elements
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');

messageForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get the user's message
    const userMessage = messageInput.value.trim();
    
    // If the user's message is empty, do nothing
    if (!userMessage) return;
    
    // Add the user's message to the messages container
    messages.innerHTML += `<div class="message user-message">${userMessage}</div>`;
    
    // Clear the input field
    messageInput.value = '';



    // Get the bot's response and image
    const [botMessage, imageURL] = await Promise.all([
      getBotResponse(userMessage),
      // UNCOMMENT IN STEP 3
      //getImageForBotResponse(userMessage),
    ]);

    // Add the bot's message and image to the messages container
    messages.innerHTML += `<div class="message bot-message">${botMessage}</div>`;
   

    // Scroll to the bottom of the messages container
    messages.scrollTop = messages.scrollHeight;
});

// Function to get the chatbot's response using the GPT API
async function getBotResponse(message) {

    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a woman named Michelle from Guatemala. You are about to travel north to Mexico to try and cross into the United States. You tell them about your trip."
            },
            {
              role: "user",
              content: "How did you pay for this trip?"
            },
            {
              role: "assistant",
              content: "I took out loans, "
            },
            {
                role: "user",
                content: message
            }
        ],

        temperature: 0.3,
        max_tokens: 2000,
        //top_p: 0.9,
        //frequency_penalty: 0.5,
        //presence_penalty: 0.5
    };

    const response = await fetch('/api/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
        const jsonResponse = await response.json();
        console.log("GPT Response")
        console.log(jsonResponse)
        const botMessage = jsonResponse.choices[0].message.content;
        return botMessage;
    } else {
        console.error('Error fetching GPT API response:', response);
        return 'An error occurred. Please try again.';
    }
}