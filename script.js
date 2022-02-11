let name = "";

addUser();
function addUser() {
name = prompt("Insira um nome para entrar no chat");
let promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: name});
};

requisition.then(validName);

function validName () {
    sendMessage();
}

promise.catch(invalidName);

function invalidName(error) {
    let statusCode = error.response.status;
    console.log(statusCode);
    alert("Este nome já foi usado anteriormente, tente outro");
    addUser(); 
}

function sendMessage()
//<- busca mensagens no servidor ->//
let promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
