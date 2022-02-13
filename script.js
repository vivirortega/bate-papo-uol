let username = "";
let user = {};

//<- VALIDA O NOME DE USUÁRIO ->//
function addUser() {
username = document.querySelector("input").value;
console.log(username);
user = { name: username }
const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", user);
promise.then(validName);
promise.catch(invalidName);
};

function validName (response) {
    let statusResponse = response.status;
     if (statusResponse === 200) {
     console.log("deu certo o nome")
     enterChat()
     } 
 }

function invalidName(error) {
    let statusCode = error.response.status;
    if (statusCode === 400) {
        alert("Este nome já foi usado anteriormente, tente outro");
        addUser(); 
    }
}

function enterChat() {
    document.querySelector(".login-screen").classList.add("hidden");
    document.querySelector(".header-bar").classList.remove("hidden");
    document.querySelector(".footer-bar").classList.remove("hidden");
    reloadMessages()
    setInterval(loadMessages, 3000);
}

//<- BUSCA AS MENSAGENS DO SERVIDOR ->//
function loadMessages() {
const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
promise.then(messageOnChat)
promise.catch(errorMessage)
};

function messageOnChat(message) {
    let dataMessage = message.data;
    let bodyMessage = document.querySelector("main");
    console.log(dataMessage);

    dataMessage.forEach(item => {

        if (item.type === 'message') {
            bodyMessage.innerHTML += `
            <div class="messageForAll message" data-identifier="message">
                <span>(${item.time})  </span> <b>${item.from}</b> para <b>${item.to}</b>: ${item.text}
            </div>           
            `
        } else if (item.type === 'private_message') {

            bodyMessage.innerHTML += `
            <div class="messagePrivate message" data-identifier="message">
            <span>(${item.time})  </span> <b>${item.from}</b> para <b>${item.to}</b>: ${item.text}
            </div>
            `
        } else if (item.type === 'status') {
            bodyMessage.innerHTML += `
            <div class="status message" data-identifier="message">
            <span>(${item.time})  </span> <b>${item.from}</b>  ${item.text}
            </div>
            `
        }
        
    })
}

function errorMessage(error) {
    let statusCode = error.response.status;
    if (statusCode === 400) {
        console.log("Não foi possível fazer o load da pagina")
    }
}


//<- ENVIA MENSAGEM PRO SERVIDOR ->//
function sendMessage() {
    message = {
        from: username,
        to: "Todos",
        text: document.querySelector("input").value,
        type: "message"
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message);
    promise.then(reloadMessages);
    promise.catch(reloadPage); 
}

function reloadMessages(){
    setInterval(loadMessages, 3000);
    console.log("loading...");
}

function reloadPage(error) {
    let statusCode = error.response.status;
    if (statusCode === 400) {
        window.location.reload();
    }
}
