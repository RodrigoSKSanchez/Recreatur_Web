{/* Exemplo Tema Atual
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

function exibirTemasAtuais(temasAtuais) {
    const token = localStorage.getItem("token");
    const corpoTemasAtuais = document.querySelector("#temasAtuais");
    while (corpoTemasAtuais.firstChild) {
        corpoTemasAtuais.removeChild(corpoTemasAtuais.lastChild);
    }
    for (let temaAtual of temasAtuais) {
        const sectionTemaAtual = document.createElement("section");
        sectionTemaAtual.className = "bg-white col-xl-3 col-md-5 col-sm-12 col border rounded-3";
        const divImagem = document.createElement("div");
        divImagem.className = "d-flex justify-content-center";
        const imagem = document.createElement("img");
        imagem.className = "align-items-center p-4 imagem-tema-atual";
        imagem.src = temaAtual.imagem;
        const titulo = document.createElement("h3");
        titulo.className = "text-center";
        titulo.innerHTML = `${temaAtual.titulo}`;
        const texto = document.createElement("p");
        texto.className = "text-center";
        texto.innerHTML = `${temaAtual.texto}`;

        divImagem.append(imagem);
        sectionTemaAtual.append(divImagem);
        sectionTemaAtual.append(titulo);
        sectionTemaAtual.append(texto);
        corpoTemasAtuais.append(sectionTemaAtual);
        if(token) {
            document.querySelector("#adicionarTemaAtual").classList.remove("d-none");
            const divBotoes = document.createElement("div");
            divBotoes.className = "d-flex justify-content-center gap-2 my-2";
            const botaoEditar = document.createElement("button");
            botaoEditar.className = "btn bg-primary";
            botaoEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>`;
            botaoEditar.onclick = () => {};
            divBotoes.append(botaoEditar);

            const botaoExcluir = document.createElement("button");
            botaoExcluir.className = "btn bg-primary";
            botaoExcluir.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;
            botaoExcluir.onclick = () => {};

            divBotoes.append(botaoExcluir);

            sectionTemaAtual.append(divBotoes);
        }
    }
}

async function obterTemasAtuais() {
    const temaAtualEndpoint = "/temas-atuais";
    const URLcompleta = `${protocolo}${baseURL}${temaAtualEndpoint}`;
    const temasAtuais = (await axios.get(URLcompleta)).data;
    exibirTemasAtuais(temasAtuais);
}

async function adicionarTemaAtual() {
    const temaAtualEndpoint = "/temas-atuais";
    const URLcompleta = `${protocolo}${baseURL}${temaAtualEndpoint}`;

    let imagemInput = document.querySelector("#imagemTemaAtualInput");
    let tituloInput = document.querySelector("#tituloTemaAtualInput");
    let textoInput = document.querySelector("#textoTemaAtualInput");

    let files = imagemInput.files;

    const fileReader = new FileReader();
    fileReader.onload = async () => {
        if(imagemInput.value && tituloInput.value && textoInput.value){
            try{
                let result = fileReader.result
                const TemasAtuais = (await axios.post(URLcompleta, {
                    titulo: tituloInput.value,
                    texto: textoInput.value,
                    imagem: result
                })).data;
                tituloInput.value = "";
                imagemInput.value = "";
                textoInput.value = "";
                exibirTemasAtuais(TemasAtuais);
                exibirAlerta('.alert-modal-tema-atual', "Tema Atual cadastrado com sucesso",
                    ['show', 'alert-success'], ['d-none', 'alert-danger'], 3000);
            }
            catch(e) {
                exibirAlerta('.alert-modal-tema-atual', "Erro ao criar o Tema Atual", ['show',
                    'alert-danger'], ['d-none', 'alert-success'], 3000);
            }
        }
        else {
            exibirAlerta('.alert-modal-tema-atual', 'Preencha todos os campos', ['show',
                'alert-danger'], ['d-none', 'alert-success'], 3000);
        }
    }
    if (files[0]) {
        fileReader.readAsDataURL(files[0]);
    }
    else {
        exibirAlerta('.alert-modal-tema-atual', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 3000);
    }

    // const TemasAtuais = (await axios.post(URLcompleta, {
    //     titulo: tituloInput.value,
    //     texto: textoInput.value,
    //     imagem: file
    // })).data;
    // console.log(TemasAtuais);
    // exibirTemasAtuais(TemasAtuais);


}