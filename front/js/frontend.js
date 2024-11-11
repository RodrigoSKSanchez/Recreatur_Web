const protocolo = 'http://';
const baseURL = 'localhost:3000';

function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove,
    timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
        alert.classList.remove('show')
        alert.classList.add('d-none')
    }, timeout)
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
            console.log(response.data)
            usuarioLoginInput.value = ""
            passwordLoginInput.value = ""
            exibirAlerta('.alert-modal-login', "Login efetuado com sucesso!",
                ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
            const cadastrarFilmeButton =
                document.querySelector('#cadastrarFilmeButton')
            cadastrarFilmeButton.disabled = false
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

{/* exemplo depoimento :
     <div
    class="col-lg-3 col-md-4 p-4 border border-secondary-subtle rounded-4 align-items-center bg-white">
    <h5>[...]Já falei pra Agatha que se tiver o curso de novo vou me alistar para ensinar os outros
        KKKK[...]</h5>
    <p class="text-start fw-semibold">Gabriel José, 16 anos</p>
</div> */}
function exibirDepoimentos(depoimentos) {
    const corpoDepoimentos = document.getElementById("depoimentos");
    while (corpoDepoimentos.firstChild) {
        corpoDepoimentos.removeChild(corpoDepoimentos.lastChild);
    }
    for(let depoimento of depoimentos){
        console.log(depoimento);
        const divDepoimento = document.createElement("div");
        divDepoimento.className = "col-lg-3 col-md-4 p-4 border border-secondary-subtle rounded-4 align-items-center bg-white";
        const textoDepoimento = document.createElement("h5");
        textoDepoimento.innerHTML = `[...] ${depoimento.texto_depoimento} [...]`;
        const infoPessoa = document.createElement("p");
        infoPessoa.className = "text-start fw-semibold";
        infoPessoa.innerHTML = `${depoimento.info_pessoa}`;      
        divDepoimento.append(textoDepoimento);
        divDepoimento.append(infoPessoa);  
        corpoDepoimentos.append(divDepoimento);
    }
}

async function obterDepoimentos() {
    const depoimentosEndPoint = '/depoimentos';
    const URLcompleta = `${protocolo}${baseURL}${depoimentosEndPoint}`;
    const depoimentos = (await axios.get(URLcompleta)).data;
    exibirDepoimentos(depoimentos);
}

async function adicionarDepoimento() {
    const depoimentosEndPoint = '/depoimentos';
    const URLcompleta = `${protocolo}${baseURL}${depoimentosEndPoint}`;

    let textoDepoimentoInput = document.querySelector("#textoDepoimentoInput");
    let infoPessoaInput = document.querySelector("#infoPessoaInput");
    let textoDepoimento = textoDepoimentoInput.value;
    let infoPessoa = infoPessoaInput.value;

    if(textoDepoimento && infoPessoa){
        try{
            const depoimentos = (await axios.post (URLcompleta, {
                texto_depoimento : textoDepoimento,
                info_pessoa : infoPessoa})).data;
            exibirDepoimentos(depoimentos);
            exibirAlerta('.alert-modal-depoimentos', "Depoimento cadastrado com sucesso",
                ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
        }
        catch(e) {
            exibirAlerta('.alert-modal-depoimentos', "Erro ao criar o depoimento", ['show',
                'alert-danger'], ['d-none', 'alert-success'], 2000)
        }
    }
    else{  
        exibirAlerta('.alert-modal-depoimentos', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 2000);
    }
}

async function editarDepoimento() {

}

async function removerDepoimento() {

}