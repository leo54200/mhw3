function enter_message_handler(event) {
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    submit_message_handler();
  }
}

async function submit_message_handler() {
  // Seleziona l'elemento input
  const input_message = document.querySelector("#input_message");
  // Se l'input è vuoto, non fare nulla
  if (input_message.value === "") {
    return;
  }
  // Seleziona il div di destinazione
  const divDestinazione = document.querySelector("#container");
  // Ottieni il testo dall'input
  const userInput = input_message.value;

  // Taglia il testo dall'input
  input_message.value = "";

  // Crea un nuovo div
  const nuovoDiv = document.createElement("div");
  // Assegna il testo tagliato al nuovo div
  nuovoDiv.textContent = userInput;
  // Aggiungi il nuovo div al contenitore
  nuovoDiv.classList.add("left");
  container.appendChild(nuovoDiv);
  //chiama la funzione per la risposta del bot
  const bot_message = await chat_bot(userInput);
  const first_word = bot_message.match(/\b\w+\b/)[0];
  // Rimuovi la prima parola dal messaggio
  let edited_bot_message = bot_message;
  if (
    first_word == "Luca" ||
    first_word == "Francesco" ||
    first_word == "Lucia"
  ) {
    edited_bot_message = bot_message.replace(first_word + ":", "").trim();
  }
  sendMessage(first_word, edited_bot_message);
}

async function next_button_handler() {
  const bot_message = await chat_bot("avanti");
  const first_word = bot_message.match(/\b\w+\b/)[0];
  // Rimuovi la prima parola dal messaggio
  let edited_bot_message = bot_message;
  if (
    first_word == "Luca" ||
    first_word == "Francesco" ||
    first_word == "Lucia"
  ) {
    edited_bot_message = bot_message.replace(first_word + ":", "").trim();
  }
  sendMessage(first_word, edited_bot_message);
}

function reset_images() {
  const guy1 = document.querySelector("#guy1");
  const speaking_guy1 = document.querySelector("#speaking_guy1");
  guy1.classList.remove("hidden");
  speaking_guy1.classList.add("hidden");
  const guy2 = document.querySelector("#guy2");
  const speaking_guy2 = document.querySelector("#speaking_guy2");
  guy2.classList.remove("hidden");
  speaking_guy2.classList.add("hidden");
  const guy3 = document.querySelector("#guy3");
  const speaking_guy3 = document.querySelector("#speaking_guy3");
  guy3.classList.remove("hidden");
  speaking_guy3.classList.add("hidden");
}

function answer(first_word) {
  reset_images();
  //Qui si può inserire la logica per la risposta del bot
  if (first_word == "Luca") {
    const guy1 = document.querySelector("#guy1");
    const speaking_guy1 = document.querySelector("#speaking_guy1");
    guy1.classList.add("hidden");
    speaking_guy1.classList.remove("hidden");
  } else if (first_word == "Francesco") {
    const guy2 = document.querySelector("#guy2");
    const speaking_guy2 = document.querySelector("#speaking_guy2");
    guy2.classList.add("hidden");
    speaking_guy2.classList.remove("hidden");
  } else {
    const guy3 = document.querySelector("#guy3");
    const speaking_guy3 = document.querySelector("#speaking_guy3");
    guy3.classList.add("hidden");
    speaking_guy3.classList.remove("hidden");
  }
}

function sendMessage(first_word, edited_bot_message) {
  const container = document.querySelector("#container");
  const newDiv = document.createElement("div");
  const username = document.createElement("div");
  const bot_answer = document.querySelector("#bot_answer");
  const history_box = document.querySelector("#history_box");
  if (
    first_word == "Luca" ||
    first_word == "Francesco" ||
    first_word == "Lucia"
  ) {
    username.textContent = first_word;
  }
  answer(first_word);
  bot_answer.classList.remove("hidden");
  newDiv.classList.add("right");
  username.classList.add("username");
  container.appendChild(newDiv);
  newDiv.textContent = edited_bot_message;
  bot_answer.textContent = edited_bot_message;
  newDiv.appendChild(username);
  history_box.scrollTop = history_box.scrollHeight;
}

async function chat_bot(userInput) {
  // Ottieni la risposta dall'API di OpenAI

  const response = await getOpenAIResponse(userInput);
  console.log(response);
  return response;
}

//Bottone per inviare i messaggi nelle varie classi
const submit_message = document.querySelector("#submit_message");
const input_message = document.querySelector("#input_message");
const next_button = document.querySelector("#next_button");
next_button.addEventListener("click", next_button_handler);
submit_message.addEventListener("click", submit_message_handler);
input_message.addEventListener("keypress", enter_message_handler);

//OpenAI API
let chatHistory = []; // Inizializzare una variabile per memorizzare la cronologia della chat

const OPENAI_API_KEY = "YOUR API KEY";

async function getOpenAIResponse(userInput, model = "gpt-4") {
  const API_URL = "https://api.openai.com/v1/chat/completions";

  // Aggiungere i messaggi precedenti alla cronologia della chat
  chatHistory.push({ role: "user", content: userInput });
  const allMessages = [
    { role: "system", content: "You are a helpful assistant." },
    ...chatHistory, // Includere tutti i messaggi precedenti
  ];

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: model,
      messages: allMessages /*[
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: userInput,
        },
      ],*/,
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await onResponse(response);
    const message = onJson(data);

    // Aggiungere il messaggio attuale alla cronologia della chat
    chatHistory.push({ role: "system", content: message });

    return message;
  } catch (error) {
    return onError(error);
  }
}

function onResponse(response) {
  return response.json();
}

function onJson(data) {
  console.log("Dati ricevuti dall'API di OpenAI:", data);
  return data.choices[0].message.content.trim();
}

function onError(error) {
  console.error("Errore durante la richiesta all'API di OpenAI:", error);
  return "Oops! Qualcosa è andato storto.";
}
