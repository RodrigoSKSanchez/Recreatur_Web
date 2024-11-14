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
    for (let depoimento of depoimentos) {
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

        const divBotoes = document.createElement("div");
        divBotoes.className = "d-flex justify-content-center gap-2";
        const botaoEditar = document.createElement("button");
        botaoEditar.className = "btn bg-primary";
        botaoEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>`;
        botaoEditar.onclick = () => abrirModalEditarDepoimento(depoimento._id, depoimento.texto_depoimento, depoimento.info_pessoa);
        divBotoes.append(botaoEditar);

        const botaoExcluir = document.createElement("button");
        botaoExcluir.className = "btn bg-primary";
        botaoExcluir.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;
        botaoExcluir.onclick = () => abrirModalRemoverDepoimento(depoimento._id, depoimento.texto_depoimento, depoimento.info_pessoa);

        divBotoes.append(botaoExcluir);

        divDepoimento.append(divBotoes);
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

    if (textoDepoimento && infoPessoa) {
        try {
            const depoimentos = (await axios.post(URLcompleta, {
                texto_depoimento: textoDepoimento,
                info_pessoa: infoPessoa
            })).data;
            textoDepoimentoInput.value = "";
            infoPessoaInput.value = "";
            exibirDepoimentos(depoimentos);
            exibirAlerta('.alert-modal-depoimentos', "Depoimento cadastrado com sucesso",
                ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000);
        }
        catch (e) {
            exibirAlerta('.alert-modal-depoimentos', "Erro ao criar o depoimento", ['show',
                'alert-danger'], ['d-none', 'alert-success'], 3000);
        }
    }
    else {
        exibirAlerta('.alert-modal-depoimentos', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }
}

function abrirModalEditarDepoimento(idDepoimento, textoDepoimento, infoPessoa) {
    document.querySelector("#idDepoimentoEditarInput").value = idDepoimento;
    document.querySelector("#textoDepoimentoEditarInput").value = textoDepoimento;
    document.querySelector("#infoPessoaEditarInput").value = infoPessoa;
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEditarDepoimentos"));
    modal.show();

}

async function editarDepoimento() {
    const idDepoimento = document.querySelector("#idDepoimentoEditarInput").value
    const textoDepoimento = document.querySelector("#textoDepoimentoEditarInput").value
    const infoPessoa = document.querySelector("#infoPessoaEditarInput").value

    const depoimentosEndPoint = '/depoimentos';
    const URLcompleta = `${protocolo}${baseURL}${depoimentosEndPoint}`;
    if (textoDepoimento && infoPessoa && idDepoimento) {
        try {
            const depoimentos = (await axios.put(URLcompleta, {
                idDepoimento: idDepoimento,
                texto_depoimento: textoDepoimento,
                info_pessoa: infoPessoa
            })).data;
            exibirDepoimentos(depoimentos);
            exibirAlerta('.alert-modal-editar-depoimentos', "Depoimento editado com sucesso",
                ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000, "#modalEditarDepoimentos");
        }
        catch (e) {
            exibirAlerta('.alert-modal-editar-depoimentos', "Erro ao editar o depoimento", ['show',
                'alert-danger'], ['d-none', 'alert-success'], 3000);
        }
    }
    else {
        exibirAlerta('.alert-modal-editar-depoimentos', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }
}

function abrirModalRemoverDepoimento(idDepoimento, textoDepoimento, infoPessoa) {
    document.querySelector("#idDepoimentoRemoverInput").value = idDepoimento;
    document.querySelector("#textoDepoimentoRemoverInput").value = textoDepoimento;
    document.querySelector("#infoPessoaRemoverInput").value = infoPessoa;
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalRemoverDepoimentos"));
    modal.show();
}

async function removerDepoimento() {
    const idDepoimento = document.querySelector("#idDepoimentoRemoverInput").value
    const depoimentosEndPoint = '/depoimentos';
    const URLcompleta = `${protocolo}${baseURL}${depoimentosEndPoint}`;
    try {
        const depoimentos = (await axios.delete(URLcompleta, {
            data: { idDepoimento }
        })).data;
        exibirDepoimentos(depoimentos);
        exibirAlerta('.alert-modal-remover-depoimentos', "Depoimento removido com sucesso",
            ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000, "#modalRemoverDepoimentos");
    }
    catch (e) {
        exibirAlerta('.alert-modal-editar-depoimentos', "Erro ao remover o depoimento", ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }
}