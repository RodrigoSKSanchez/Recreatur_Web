{/* Exemplo Tema Anual
    <section class="bg-white col-md-3 col-12 border rounded-3">
        <div class=" d-flex justify-content-center">
          <img class="align-items-center col-12 p-4" src="imagens/2009.jpg" alt="Imagem 2009">
        </div>
        <h3 class="text-center">2009 - História e Cultura do bairro Jaraguá</h3>
        <p class="text-center">Levando aos alunos toda a riqueza que esse bairro oferece, o RecreaTur de 2009 trabalhou
          o senso de pertencimento dos jovens, através do ensinamento sobre a história e cultura do bairro onde vivem,
          dando destaque também para a atividade turística no local.</p>
      </section>
*/}

function exibirTemasAnuais(temasAnuais) {
    const token = localStorage.getItem("token");
    const corpoTemasAnuais = document.querySelector("#temasAnuais");
    while (corpoTemasAnuais.firstChild) {
        corpoTemasAnuais.removeChild(corpoTemasAnuais.lastChild);
    }
    for (let temaAnual of temasAnuais) {
        const sectionTemaAnual = document.createElement("section");
        sectionTemaAnual.className = "bg-white col-xl-3 col-md-5 col-sm-12 col border rounded-3";
        const divImagem = document.createElement("div");
        divImagem.className = "d-flex justify-content-center";
        const imagem = document.createElement("img");
        imagem.className = "align-items-center p-4 imagem-tema-anual";
        imagem.src = temaAnual.imagem;
        const titulo = document.createElement("h3");
        titulo.className = "text-center";
        titulo.innerHTML = `${temaAnual.titulo}`;
        const texto = document.createElement("p");
        texto.className = "text-center";
        texto.innerHTML = `${temaAnual.texto}`;

        divImagem.append(imagem);
        sectionTemaAnual.append(divImagem);
        sectionTemaAnual.append(titulo);
        sectionTemaAnual.append(texto);
        corpoTemasAnuais.append(sectionTemaAnual);
        if (token) {
            const divBotoes = document.createElement("div");
            divBotoes.className = "d-flex justify-content-center gap-2 my-2";
            const botaoEditar = document.createElement("button");
            botaoEditar.className = "btn bg-primary";
            botaoEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>`;
            botaoEditar.onclick = () => abrirModalEditarTemaAnual(temaAnual._id, temaAnual.imagem, temaAnual.titulo, temaAnual.texto);
            divBotoes.append(botaoEditar);

            const botaoExcluir = document.createElement("button");
            botaoExcluir.className = "btn bg-danger";
            botaoExcluir.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;
            botaoExcluir.onclick = () => abrirModalRemoverTemaAnual(temaAnual._id, temaAnual.imagem, temaAnual.titulo, temaAnual.texto);

            divBotoes.append(botaoExcluir);

            sectionTemaAnual.append(divBotoes);
        }
    }
    if (token) {
        document.querySelector("#adicionarTemaAnual").classList.remove("d-none");
    }
}

async function obterTemasAnuais() {
    const temaAnualEndpoint = "/temas-anuais";
    const URLcompleta = `${protocolo}${baseURL}${temaAnualEndpoint}`;
    const temasAnuais = (await axios.get(URLcompleta)).data;
    exibirTemasAnuais(temasAnuais);
}

async function adicionarTemaAnual() {
    const temaAnualEndpoint = "/temas-anuais";
    const URLcompleta = `${protocolo}${baseURL}${temaAnualEndpoint}`;

    let imagemInput = document.querySelector("#imagemTemaAnualInput");
    let tituloInput = document.querySelector("#tituloTemaAnualInput");
    let textoInput = document.querySelector("#textoTemaAnualInput");

    let files = imagemInput.files;

    const fileReader = new FileReader();
    fileReader.onload = async () => {
        if (imagemInput.value && tituloInput.value && textoInput.value) {
            try {
                let result = fileReader.result
                const TemasAnuais = (await axios.post(URLcompleta, {
                    titulo: tituloInput.value,
                    texto: textoInput.value,
                    imagem: result
                })).data;
                tituloInput.value = "";
                imagemInput.value = "";
                textoInput.value = "";
                exibirTemasAnuais(TemasAnuais);
                exibirAlerta('.alert-modal-tema-anual', "Tema Anual cadastrado com sucesso",
                    ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000);
            }
            catch (e) {
                exibirAlerta('.alert-modal-tema-anual', "Erro ao criar o Tema Anual", ['show',
                    'alert-danger'], ['d-none', 'alert-success'], 3000);
            }
        }
        else {
            exibirAlerta('.alert-modal-tema-anual', 'Preencha todos os campos', ['show',
                'alert-danger'], ['d-none', 'alert-success'], 3000);
        }
    }
    if (files[0]) {
        fileReader.readAsDataURL(files[0]);
    }
    else {
        exibirAlerta('.alert-modal-tema-anual', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }
}

function abrirModalEditarTemaAnual(idTemaAnual, imagemTemaAnual, tituloTemaAnual, textoTemaAnual) {
    document.querySelector("#idTemaAnualEditarInput").value = idTemaAnual;
    document.querySelector("#imagemAnualEditar").src = imagemTemaAnual;
    document.querySelector("#tituloTemaAnualEditarInput").value = tituloTemaAnual;
    document.querySelector("#textoTemaAnualEditarInput").value = textoTemaAnual;
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEditarTemasAnuais"));
    modal.show();
}

async function editarTemaAnual() {
    async function enviarEdicao(id, imagem, titulo, texto) {
        const temaAnualEndpoint = "/temas-anuais";
        const URLcompleta = `${protocolo}${baseURL}${temaAnualEndpoint}`;

        try {
            const temasAnuais = (await axios.put(URLcompleta, {
                idTemaAnual: id,
                imagem: imagem,
                titulo: titulo,
                texto: texto,
            })).data;
            exibirTemasAnuais(temasAnuais);
            exibirAlerta('.alert-modal-editar-tema-anual', 'Tema Anual editado com sucesso', ['show',
                'alert-success'], ['d-none', 'alert-danger'], 3000, "#modalEditarTemasAnuais");
        }
        catch (e) {
            exibirAlerta('.alert-modal-editar-tema-anual', 'Erro ao editar o Tema Anual', ['show',
                'alert-danger'], ['d-none', 'alert-success'], 3000);
                console.log(e);
        }
    }

    const idTemaAnual = document.querySelector("#idTemaAnualEditarInput").value;
    const imagemTemaAnual = document.querySelector("#imagemTemaAnualEditarInput").files[0];
    const tituloTemaAnual = document.querySelector("#tituloTemaAnualEditarInput").value;
    const textoTemaAnual = document.querySelector("#textoTemaAnualEditarInput").value;


    if (idTemaAnual && tituloTemaAnual && textoTemaAnual) {
        if (imagemTemaAnual) {
            const fileReader = new FileReader(imagemTemaAnual);
            fileReader.readAsDataURL(imagemTemaAnual);
            fileReader.onload = async () => {
                const result = fileReader.result;
                enviarEdicao(idTemaAnual, result, tituloTemaAnual,textoTemaAnual);
            };
        }
        else {
            enviarEdicao(idTemaAnual,document.querySelector("#imagemAnualEditar").src, tituloTemaAnual, textoTemaAnual);
        }
    }
    else {
        exibirAlerta('.alert-modal-editar-tema-anual', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }

}

function abrirModalRemoverTemaAnual(idTemaAnual, imagemTemaAnual, tituloTemaAnual, textoTemaAnual) {
    document.querySelector("#idTemaAnualRemoverInput").value = idTemaAnual;
    document.querySelector("#imagemAnualRemover").src = imagemTemaAnual;
    document.querySelector("#tituloTemaAnualRemoverInput").value = tituloTemaAnual;
    document.querySelector("#textoTemaAnualRemoverInput").value = textoTemaAnual;
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalRemoverTemasAnuais"));
    modal.show();
}

async function removerTemaAnual(){
    const idTemaAnual = document.querySelector("#idTemaAnualRemoverInput").value;
    const temaAnualEndpoint = "/temas-anuais";
    const URLcompleta = `${protocolo}${baseURL}${temaAnualEndpoint}`;

    try {
        const temasAnuais = (await axios.delete(URLcompleta, {
            data: { idTemaAnual }
        })).data;
        exibirTemasAnuais(temasAnuais);
        exibirAlerta('.alert-modal-remover-tema-anual', "Tema Anual removido com sucesso",
            ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000, "#modalRemoverTemasAnuais");
    }
    catch(e) {
        exibirAlerta('.alert-modal-remover-tema-anual', "Erro ao remover o Tema Anual", ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }

}
