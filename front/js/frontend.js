const protocolo = 'http://';
const baseURL = 'localhost:3000';

function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove,
    timeout, modalSeletor) {
    let alert = document.querySelector(seletor);
    alert.innerHTML = innerHTML;
    alert.classList.add(...classesToAdd);
    alert.classList.remove(...classesToRemove);
    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('d-none');
        if(modalSeletor){
            setTimeout(() =>{
                let modal = bootstrap.Modal.getOrCreateInstance(document.querySelector(modalSeletor));
                modal.hide();
            }, 1000);
        }
    }, timeout);
}

async function fazerLogin() {
    let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
    let passwordLoginInput = document.querySelector('#passwordLoginInput')
    let usuarioLogin = usuarioLoginInput.value
    let passwordLogin = passwordLoginInput.value
    if (usuarioLogin && passwordLogin) {
        try {
            const loginEndpoint = '/login'
            const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
            const response = await axios.post(
                URLCompleta,
                { login: usuarioLogin, password: passwordLogin }
            )
            localStorage.setItem("token", response.data);
            fazerLogout();
            usuarioLoginInput.value = ""
            passwordLoginInput.value = ""
            exibirAlerta('.alert-modal-login', "Login efetuado com sucesso!",
                ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
            
        }
        catch (error) {
            exibirAlerta('.alert-modal-login', "Erro ao fazer login", ['show',
                'alert-danger'], ['d-none', 'alert-success'], 2000)
        }
    }
    else {
        exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}

function fazerLogout() {
    let token = localStorage.getItem("token");
    let divLogin = document.querySelector("#divLogin");
    if(token && divLogin) {
        while (divLogin.firstChild) {
            divLogin.removeChild(divLogin.lastChild);
        }
        let botaoLogout = document.createElement("button");
        botaoLogout.innerText = "Logout";
        botaoLogout.className = "btn btn-primary";
        divLogin.append(botaoLogout);
        console.log(divLogin);
        botaoLogout.onclick = function() {
            localStorage.removeItem("token");
            divLogin.removeChild(botaoLogout);
            let linkLogin = document.createElement("a");
            linkLogin.className = "nav-link";
            linkLogin.href = "login.html";
            let linkTexto = document.createElement("h5");
            linkTexto.textContent = "Espaço adm";
            linkLogin.append(linkTexto);
            divLogin.append(linkLogin);
            console.log(divLogin);
        }
    }

}

function prepararPagina() {
    fazerLogout();
}
