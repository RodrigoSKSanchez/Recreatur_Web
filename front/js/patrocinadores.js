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
    for(let patrocinador of patrocinadores) {
        const sectionPatrocinador = document.createElement("section");
        sectionPatrocinador.className = "d-flex flex-column flex-lg-row col bg-white align-items-center";
        const imagem = document.createElement("img");
        imagem.style = "width: 540px; height: 304px;"
        imagem.src = patrocinador.imagem;
        const divTexto = document.createElement("div");
        divTexto.className = "d-flex flex-column col";
        const nomePatrocinador = document.createElement("h2");
        nomePatrocinador.innerHTML = `${patrocinador.nome}`;
        const descricaoPatrocinador = document.createElement("p");
        descricaoPatrocinador.innerHTML = `${patrocinador.descricao}`;

        divTexto.append(nomePatrocinador);
        divTexto.append(descricaoPatrocinador);
        sectionPatrocinador.append(imagem);
        sectionPatrocinador.append(divTexto);

        if(token) {
            document.querySelector("#adicionarPatrocinador").classList.remove("d-none");
            const divBotoes = document.createElement("div");
            divBotoes.className = "d-flex justify-content-center gap-2 my-2";
            const botaoEditar = document.createElement("button");
            botaoEditar.className = "btn bg-primary";
            botaoEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>`;
            botaoEditar.onclick = () => {}
            divBotoes.append(botaoEditar);

            const botaoExcluir = document.createElement("button");
            botaoExcluir.className = "btn bg-primary";
            botaoExcluir.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;
            botaoExcluir.onclick = () => {}
            divBotoes.append(botaoExcluir);

            sectionPatrocinador.append(divBotoes);
        }
    }
}