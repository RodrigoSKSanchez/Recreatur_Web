{ /* Exemplo Patrocinador
    <section class="d-flex flex-column flex-lg-row col bg-white align-items-center">
        <img src="imagens/dsm.png" style="width: 540px; height: 304px;">
        <div class="d-flex flex-column col">
          <h2>
            dsm-firmenich
          </h2>
          <p>
            Todos os nossos negócios têm um histórico de inovações pioneiras – e um futuro ainda mais promissor como parte da dsm-firmenich. São todos virtuosos em seus respectivos campos e contam com uma base sólida de excelência científica e tecnológica, um portfólio abrangente de ingredientes e a melhor expertise empresarial do setor.
          </p>
        </div>
      </section>*/}

function exibirPatrocinadores(patrocinadores) {
    const token = localStorage.getItem("token");
    const corpoPatrocinadores = document.querySelector("#patrocinadores");
    while (corpoPatrocinadores.firstChild) {
        corpoPatrocinadores.removeChild(corpoPatrocinadores.lastChild);
    }
    for (let patrocinador of patrocinadores) {
        const sectionPatrocinador = document.createElement("section");
        sectionPatrocinador.className = "d-flex flex-column flex-lg-row col-12 my-4 bg-white align-items-center";
        const imagem = document.createElement("img");
        imagem.className = "imagem-patrocinador";
        imagem.src = patrocinador.imagem;
        const divTexto = document.createElement("div");
        divTexto.className = "d-flex flex-column col";
        const nomePatrocinador = document.createElement("h2");
        nomePatrocinador.innerHTML = `${patrocinador.nome_patrocinador}`;
        const descricaoPatrocinador = document.createElement("p");
        descricaoPatrocinador.innerHTML = `${patrocinador.descricao}`;

        divTexto.append(nomePatrocinador);
        divTexto.append(descricaoPatrocinador);
        sectionPatrocinador.append(imagem);
        sectionPatrocinador.append(divTexto);
        corpoPatrocinadores.append(sectionPatrocinador);

        if (token) {
            const divBotoes = document.createElement("div");
            divBotoes.className = "d-flex justify-content-center gap-2 my-2";
            const botaoEditar = document.createElement("button");
            botaoEditar.className = "btn bg-primary";
            botaoEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>`;
            botaoEditar.onclick = () => abrirModalEditarPatrocinador(patrocinador._id, patrocinador.imagem, patrocinador.nome_patrocinador, patrocinador.descricao);
            divBotoes.append(botaoEditar);

            const botaoExcluir = document.createElement("button");
            botaoExcluir.className = "btn bg-danger";
            botaoExcluir.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;
            botaoExcluir.onclick = () => abrirModalRemoverPatrocinador(patrocinador._id, patrocinador.imagem, patrocinador.nome_patrocinador, patrocinador.descricao);
            divBotoes.append(botaoExcluir);

            descricaoPatrocinador.append(divBotoes);
        }
    }
    if (token) {
        document.querySelector("#adicionarPatrocinador").classList.remove("d-none");
    }
}

async function obterPatrocinadores() {
    const patrocinadoresEndPoint = "/patrocinadores";
    const URLcompleta = `${protocolo}${baseURL}${patrocinadoresEndPoint}`;
    const patrocinadores = (await axios.get(URLcompleta)).data;
    exibirPatrocinadores(patrocinadores);
}

async function adicionarPatrocinador() {
    const patrocinadoresEndPoint = "/patrocinadores";
    const URLcompleta = `${protocolo}${baseURL}${patrocinadoresEndPoint}`;

    let imagemInput = document.querySelector("#imagemPatrocinadorInput");
    let nomePatrocinadorInput = document.querySelector("#nomePatrocinadorInput");
    let descricaoInput = document.querySelector("#descricaoPatrocinadorInput");

    let files = imagemInput.files;

    const fileReader = new FileReader();
    fileReader.onload = async () => {
        if (imagemInput.value && nomePatrocinadorInput.value && descricaoInput.value) {
            try {
                let result = fileReader.result;
                const patrocinadores = (await axios.post(URLcompleta, {
                    nome_patrocinador: nomePatrocinadorInput.value,
                    descricao: descricaoInput.value,
                    imagem: result
                })).data;
                nomePatrocinadorInput.value = "";
                imagemInput.value = "";
                descricaoInput.value = "";
                exibirPatrocinadores(patrocinadores);
                exibirAlerta('.alert-modal-patrocinador', "Patrocinador cadastrado com sucesso",
                    ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000);
            }
            catch (e) {
                exibirAlerta('.alert-modal-patrocinador', "Erro ao criar o patrocinador", ['show',
                    'alert-danger'], ['d-none', 'alert-success'], 3000);
            }
        }
    }
    if (files[0]) {
        fileReader.readAsDataURL(files[0]);
    }
    else {
        exibirAlerta('.alert-modal-patrocinador', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }
}

function abrirModalEditarPatrocinador(idPatrocinador, imagemPatrocinador, nomePatrocinador, descricaoPatrocinador) {

    document.querySelector("#idPatrocinadorEditarInput").value = idPatrocinador;
    document.querySelector("#imagemAtualEditar").src = imagemPatrocinador;
    document.querySelector("#nomePatrocinadorEditarInput").value = nomePatrocinador;
    document.querySelector("#descricaoPatrocinadorEditarInput").value = descricaoPatrocinador;

    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEditarPatrocinador"));
    modal.show();
}

async function editarPatrocinador() {
    async function enviarEdicao(idPatrocinador, imagem, nomePatrocinador, descricao) {
        const patrocinadoresEndPoint = "/patrocinadores";
        const URLcompleta = `${protocolo}${baseURL}${patrocinadoresEndPoint}`;
        try {
            const patrocinadores = (await axios.put(URLcompleta, {
                idPatrocinador: idPatrocinador,
                nome_patrocinador: nomePatrocinador,
                descricao: descricao,
                imagem: imagem
            })).data;
            exibirPatrocinadores(patrocinadores);
            exibirAlerta('.alert-modal-editar-patrocinador', 'Patrocinador editado com sucesso', ['show',
                'alert-success'], ['d-none', 'alert-danger'], 3000, "#modalEditarPatrocinador");
        }
        catch (e) {
            exibirAlerta('.alert-modal-editar-patrocinador', 'Erro ao editar o patrocinador', ['show',
                'alert-danger'], ['d-none', 'alert-success'], 3000);
            console.log(e);
        }
    }
    const idPatrocinador = document.querySelector("#idPatrocinadorEditarInput").value;
    const imagemPatrocinador = document.querySelector("#imagemPatrocinadorEditarInput").files[0];
    const nomePatrocinador = document.querySelector("#nomePatrocinadorEditarInput").value;
    const descricaoPatrocinador = document.querySelector("#descricaoPatrocinadorEditarInput").value;

    if (idPatrocinador && nomePatrocinador && descricaoPatrocinador) {
        if (imagemPatrocinador) {
            const fileReader = new FileReader(imagemPatrocinador);
            fileReader.readAsDataURL(imagemPatrocinador);
            fileReader.onload = async () => {
                const result = fileReader.result;
                enviarEdicao(idPatrocinador, result, nomePatrocinador, descricaoPatrocinador);
            };
        }
        else {
            enviarEdicao(idPatrocinador, document.querySelector("#imagemAtualEditar").src, nomePatrocinador, descricaoPatrocinador);
        }
    }
    else {
        exibirAlerta('.alert-modal-editar-patrocinador', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }
}

function abrirModalRemoverPatrocinador(idPatrocinador, imagemPatrocinador, nomePatrocinador, descricaoPatrocinador) {
    document.querySelector("#idPatrocinadorRemoverInput").value = idPatrocinador;
    document.querySelector("#imagemAtualRemover").src = imagemPatrocinador;
    document.querySelector("#nomePatrocinadorRemoverInput").value = nomePatrocinador;
    document.querySelector("#descricaoPatrocinadorRemoverInput").value = descricaoPatrocinador;

    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalRemoverPatrocinador"));
    modal.show();
}

async function removerPatrocinador() {
    const idPatrocinador = document.querySelector("#idPatrocinadorRemoverInput").value;
    const patrocinadoresEndPoint = "/patrocinadores";
    const URLcompleta = `${protocolo}${baseURL}${patrocinadoresEndPoint}`;

    try {
        const patrocinadores = (await axios.delete(URLcompleta, {
            data: { idPatrocinador }
        })).data;
        exibirPatrocinadores(patrocinadores);
        exibirAlerta('.alert-modal-remover-patrocinador', "Patrocinador removido com sucesso",
            ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000, "#modalRemoverPatrocinador");
    }
    catch (e) {
        exibirAlerta('.alert-modal-remover-patrocinador', "Erro ao remover o patrocinador", ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }

}

async function enviarMensagem() {
    const mensagemPatrocinadoresEndPoint = "/mensagem-patrocinadores";
    const URLcompleta = `${protocolo}${baseURL}${mensagemPatrocinadoresEndPoint}`;

    const nomeInput = document.querySelector("#nomeInput").value;
    const sobrenomeInput = document.querySelector("#sobrenomeInput").value;
    const emailInput = document.querySelector("#emailInput").value;
    const mensagemInput = document.querySelector("#mensagemInput").value;

    if (nomeInput && sobrenomeInput && emailInput && mensagemInput) {
        try {
            await axios.post(URLcompleta, {
                nome: nomeInput,
                sobrenome: sobrenomeInput,
                email: emailInput,
                mensagem: mensagemInput
            });
            exibirAlerta('.alert-enviar-mensagem', "Mensagem enviada com sucesso",
                ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000, "#modalRemoverPatrocinador");

        }
        catch (e) {
            exibirAlerta('.alert-enviar-mensagem', "Erro ao enviar a mensagem", ['show',
                'alert-danger'], ['d-none', 'alert-success'], 3000);
        }
    }
    else {
        exibirAlerta('.alert-enviar-mensagem', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }


}

async function obterMensagens() {
    const mensagemPatrocinadoresEndPoint = "/mensagem-patrocinadores";
    const URLcompleta = `${protocolo}${baseURL}${mensagemPatrocinadoresEndPoint}`;

    const mensagens = (await axios.get(URLcompleta)).data;
    exibirMensagens(mensagens);
}

function exibirMensagens(mensagens) {
    const corpoMensagemPatrocinadores = document.querySelector("#mensagens");
    
    while (corpoMensagemPatrocinadores.firstChild) {
        corpoMensagemPatrocinadores.removeChild(corpoMensagemPatrocinadores.lastChild);
    }

    for (let mensagem of mensagens) {
        let divMensagem = document.createElement("div");
        divMensagem.className = "d-flex border rounded-3 my-4 justify-content-between";
        let emailMensagem = document.createElement("h2");
        emailMensagem.innerHTML = mensagem.email;
        emailMensagem.className = "m-2";
        divMensagem.append(emailMensagem);

        corpoMensagemPatrocinadores.append(divMensagem);
        let divBotoes = document.createElement("div");
        divMensagem.append(divBotoes);
        divBotoes.className = `d-flex justify-content-center gap-2 m-2`;
        

        let botaoVer = document.createElement("button");
        botaoVer.className = "btn bg-primary";
        botaoVer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
</svg>`;
        botaoVer.onclick = () => verMensagem(mensagem.nome, mensagem.sobrenome, mensagem.email, mensagem.mensagem);
        divBotoes.append(botaoVer);

        let botaoExcluir = document.createElement("button");
        botaoExcluir.className = "btn bg-danger";
        botaoExcluir.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;
        botaoExcluir.onclick = () => abrirModalRemoverMensagem(mensagem._id, mensagem.nome, mensagem.sobrenome, mensagem.email, mensagem.mensagem);
        divBotoes.append(botaoExcluir);
    
    }
}

function prepararFormulario() {
    const token = localStorage.getItem("token");
    if (token) {
        document.querySelector("#enviar-mensagem").classList.add("d-none");
        document.querySelector("#ver-mensagens").classList.remove("d-none");
        obterMensagens();
    }
}

function verMensagem(nome, sobrenome, email, mensagem) {
    document.querySelector("#nomeVerMensagem").value = nome;
    document.querySelector("#sobrenomeVerMensagem").value = sobrenome;
    document.querySelector("#emailVerMensagem").value = email;
    document.querySelector("#mensagemVerMensagem").value = mensagem;
    
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalVerMensagens"));
    modal.show();
}

function abrirModalRemoverMensagem(id, nome, sobrenome, email, mensagem) {
    document.querySelector("#idMensagemRemoverMensagem").value = id;
    document.querySelector("#nomeRemoverMensagem").value = nome;
    document.querySelector("#sobrenomeRemoverMensagem").value = sobrenome;
    document.querySelector("#emailRemoverMensagem").value = email;
    document.querySelector("#mensagemRemoverMensagem").value = mensagem;
    
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalRemoverMensagens"));
    modal.show();
}

async function removerMensagem() {
    const idMensagem = document.querySelector("#idMensagemRemoverMensagem").value;
    const mensagemPatrocinadoresEndPoint = "/mensagem-patrocinadores";
    const URLcompleta = `${protocolo}${baseURL}${mensagemPatrocinadoresEndPoint}`;

    try {
        const mensagens = (await axios.delete(URLcompleta, {
            data: { idMensagem }
        })).data;
        exibirMensagens(mensagens);
        exibirAlerta('.alert-modal-remover-mensagem', "Mensagem removida com sucesso",
            ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000, "#modalRemoverMensagens");
    }
    catch (e) {
        exibirAlerta('.alert-modal-remover-mensagem', "Erro ao remover a mensagem", ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }
}

