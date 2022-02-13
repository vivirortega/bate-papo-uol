let username = "";
let user = {};


addUser();

function addUser() {
username = prompt("Insira um nome para entrar no chat");
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
     loadMessages()
     } 
    
    }

function invalidName(error) {
    let statusCode = error.response.status;
    if (statusCode === 400) {
        alert("Este nome já foi usado anteriormente, tente outro");
        addUser(); 
}
}

function loadMessages() {
//<- busca mensagens no servidor ->//
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
            <div class="mensagemParaTodos mensagem" data-identifier="message">
                <span>(${item.time})  </span> <b>${item.from}</b> para <b>${item.to}</b>: ${item.text}
            </div>           
            `
        } else if (item.type === 'private_message') {

            bodyMessage.innerHTML += `
            <div class="mensagemPrivada mensagem" data-identifier="message">
            <span>(${item.time})  </span> <b>${item.from}</b> para <b>${item.to}</b>: ${item.text}
            </div>
            `
        } else if (item.type === 'status') {
            bodyMessage.innerHTML += `
            <div class="status mensagem" data-identifier="message">
            <span>(${item.time})  </span> <b>${item.from}</b>  ${item.text}
            </div>
            `
        }
    })
}

function errorMessage (error) {
    let statusCode = error.response.status;
    if (statusCode === 400) {
        console.log("Não foi possível fazer o load da pagina")
    }
}