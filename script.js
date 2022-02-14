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
        window.location.reload();
    }
}

function enterChat() {
     document.querySelector(".login-screen").classList.add("hidden");
     document.querySelector(".header-bar").classList.remove("hidden");
     document.querySelector(".footer-bar").classList.remove("hidden");
     loadMessages();
     reloadMessages();
     verifyUserOnline();
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
     bodyMessage.innerHTML = "";

    dataMessage.forEach(item => {

        if (item.type === 'message') {
            bodyMessage.innerHTML += `
            <div class="messageForAll message" data-identifier="message">
                <span>(${item.time})  </span> <b class="bold">${item.from}</b> para <b class="bold">${item.to}</b>: ${item.text}
            </div>           
            `
        } else if (item.type === 'private_message') {

            bodyMessage.innerHTML += `
            <div class="messagePrivate message" data-identifier="message">
            <span>(${item.time})  </span> <b class="bold">${item.from}</b> para <b class="bold">${item.to}</b>: ${item.text}
            </div>
            `
        } else if (item.type === 'status') {
            bodyMessage.innerHTML += `
            <div class="status message" data-identifier="message">
            <span>(${item.time})  </span> <b class="bold">${item.from}</b>  ${item.text}
            </div>
            `
        }

        bodyMessage.innerHTML;
        scroll()
    })
}

function scroll() {
   window.scrollTo(000, document.body.scrollHeight);
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
        text: document.querySelector("#button-chat").value,
        type: "message"
     }
     const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message);
     document.querySelector("#button-chat").value = "";
     promise.then(reloadMessages);
     promise.catch(reloadPage); 
     
}

function reloadMessages(){
    setInterval(loadMessages, 3000);
    console.log("loading...");
    sendWithEnter();    
}

function reloadPage(error) {
     let statusCode = error.response.status;
     if (statusCode === 400) {
         window.location.reload();
     }
}

//<- ENVIA MENSAGEM PELO ENTER ->//
function sendWithEnter() {
document.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        console.log("apertou enter");
        const button = document.querySelector("#button-chat");
        button.click();
        sendMessage()
    }
});
}

//<- VERIFICA SE O USUÁRIO AINDA ESTÁ LOGADO //->
function verifyUserOnline(){
    setInterval(function(){
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", user);
        console.log("Verificando se o user está online...")
        promise.catch(errorUserOffline);
        }, 5000);
}

function errorUserOffline(error) {
    if (error.response.status === 400);
     console.log("erro no usuário");
      window.location.reload();
}