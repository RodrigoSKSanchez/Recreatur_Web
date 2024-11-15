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
    const corpoTemasAtuais = document.getElementById("temasAtuais");
    while (corpoTemasAtuais.firstChild) {
        corpoTemasAtuais.remove(corpoTemasAtuais.lastChild);
    }
    for (let temaAtual of temasAtuais) {
        const sectionTemaAtual = document.createElement("section");
        sectionTemaAtual.className = "bg-white col-md-4 border rounded-3";
        const divImagem = document.createElement("div");
        divImagem.className = "d-flex justify-content-center";
        const imagem = document.createElement("img");
        imagem.className = "align-items-center p-4";
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

    const TemasAtuais = (await axios.post(URLcompleta, {
        titulo: tituloInput.value,
        texto: textoInput.value,
        imagem: imagemInput.value
    })).data;
    console.log(TemasAtuais);
    exibirTemasAtuais(TemasAtuais);


}