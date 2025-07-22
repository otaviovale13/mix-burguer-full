// JS DA HOME - ADM - INICIO
function criarModal() {
    const modal = document.createElement("div");
    modal.id = "popUpsAdicionar";
    modal.className = "popUpsAdicionar";
    modal.style.display = "none";
    document.body.appendChild(modal);
}

function trocarRede() {
    let modal = document.getElementById("popUpsAdicionar");

    if (!modal) {
        criarModal();
        modal = document.getElementById("popUpsAdicionar");
    }

    modal.style.display = "flex";
    modal.innerHTML = `
    <div class="popUpEdit">
      <div class="btnsInputs">
          <h1>Editar Rede Social</h1>
      </div>
      <div class="btnsInputs">
          <label for="inputRedes">Escolha qual Rede Editar</label>
          <select class="border-solid-1px-black text-black text-center"
                  id="inputRedes">
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Telefone">Telefone</option>
              <option value="Facebook">Facebook</option>
          </select>
      </div>
      <div class="btnsInputs">
          <label for="inputNome">Mudar o Nome</label>
          <input class="border-solid-1px-black text-black text-center"
                 type="text"
                 id="inputNome">
      </div>
      <div class="btnsInputs">
          <label for="inputLink">Mudar o Link</label>
          <input class="border-solid-1px-black text-black text-center"
                 type="text"
                 id="inputLink">
      </div>
      <div class="btnsSalvar">
          <button class="btnCardapioAriel" onclick="salvarContato()">Sim</button>
          <button class="btnCardapioAriel" onclick="fecharModal()">Não</button>
      </div>
    </div>
  `;

    // Adiciona evento para atualizar os campos ao trocar a rede
    document.getElementById("inputRedes").addEventListener("change", atualizarCamposModal);

    // Chama a função para preencher os campos inicialmente
    atualizarCamposModal();
}

function atualizarCamposModal() {
    const redeSelecionada = document.getElementById("inputRedes").value;
    let nomeAtual = "";
    let linkAtual = "";

    if (redeSelecionada === "WhatsApp") {
        nomeAtual = document.getElementById("whats")?.textContent || "WhatsApp";
        linkAtual = document.getElementById("whatsLink")?.href || "";
    } else if (redeSelecionada === "Instagram") {
        nomeAtual = document.getElementById("insta")?.textContent || "Instagram";
        linkAtual = document.getElementById("instaLink")?.href || "";
    } else if (redeSelecionada === "Telefone") {
        nomeAtual = document.getElementById("tele")?.textContent || "Telefone";
        linkAtual = document.getElementById("teleLink")?.href.replace("tel:", "") || "";
    } else if (redeSelecionada === "Facebook") {
        nomeAtual = document.getElementById("face")?.textContent || "Facebook";
        linkAtual = document.getElementById("faceLink")?.href || "";
    }

    document.getElementById("inputNome").value = nomeAtual;
    document.getElementById("inputLink").value = linkAtual;
}

function fecharModal() {
    const modal = document.getElementById("popUpsAdicionar");
    if (modal) modal.style.display = "none";
}

function salvarContato() {
    const redeSelecionada = document.getElementById("inputRedes").value;
    const novoNome = document.getElementById("inputNome").value;
    const novoLink = document.getElementById("inputLink").value;

    if (novoNome === "" || novoLink === "") {
        exibirAlerta("Preencha todos os campos para salvar!");
        return;
    }

    fetch('/Home/AtualizarContato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `rede=${encodeURIComponent(redeSelecionada)}&nome=${encodeURIComponent(novoNome)}&link=${encodeURIComponent(novoLink)}`
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao salvar no banco");
            return response.text();
        })
        .then(data => {
            // Atualiza visualmente se sucesso
            if (redeSelecionada === "WhatsApp") {
                document.getElementById("whats").textContent = novoNome;
                document.getElementById("whatsLink").href = novoLink;
            } else if (redeSelecionada === "Instagram") {
                document.getElementById("insta").textContent = novoNome;
                document.getElementById("instaLink").href = novoLink;
            } else if (redeSelecionada === "Telefone") {
                document.getElementById("tele").textContent = novoNome;
                document.getElementById("teleLink").href = `tel:${novoLink}`;
            } else if (redeSelecionada === "Facebook") {
                document.getElementById("face").textContent = novoNome;
                document.getElementById("faceLink").href = novoLink;
            }

            fecharModal();
        })
        .catch(error => {
            console.error(error);
            exibirAlerta("Erro ao salvar no banco.");
        });
}

function trocarVideoEImagem() {
    let modal = document.getElementById("popUpsAdicionar");

    if (!modal) {
        criarModal();
        modal = document.getElementById("popUpsAdicionar");
    }

    modal.style.display = "flex";

    modal.innerHTML = `
      <div class="popUpEdit">
          <div class="btnsInputs">
              <h1>Escolha qual item editar</h1>
          </div>
          <div class="btnsInputs">
              <label for="selecaoImagemVideo">Escolha:</label>
              <select id="selecaoImagemVideo" onchange="verificarTipo()">
                  <option value="videosmais1">Vídeo - 1</option>
                  <option value="foto1">Foto - 1</option>
                  <option value="videosmais2">Vídeo - 2</option>
                  <option value="foto2">Foto - 2</option>
                  <option value="videosmais3">Vídeo - 3</option>
                  <option value="foto3">Foto - 3</option>
                  <option value="videosmais4">Vídeo - 4</option>
                  <option value="foto4">Foto - 4</option>
              </select>
          </div>
          <div class="btnsInputs">
              <label for="inputArquivo">Enviar Arquivo:</label>
              <input type="file" id="inputArquivo" accept="image/*,video/*">
          </div>
          <div id="btnLink" class="btnLink">
              <label for="inputLink">Enviar Link:</label>
              <input type="text" id="inputLinkFotos">
          </div>
          <div class="btnsSalvar">
              <button class="btnCardapioAriel" onclick="salvarAlteracao()">Salvar</button>
              <button class="btnCardapioAriel" onclick="fecharModal()">Fechar</button>
          </div>
      </div>
  `;

    verificarTipo();
}

function fecharModal() {
    document.getElementById("popUpsAdicionar").style.display = "none";
}

function verificarTipo() {
    let selecao = document.getElementById("selecaoImagemVideo").value;
    let btnLink = document.getElementById("btnLink");

    if (selecao.includes("video")) {
        btnLink.style.display = "flex";
    } else {
        btnLink.style.display = "none";
    }
}

function salvarAlteracao() {
    let selecao = document.getElementById("selecaoImagemVideo").value;
    let novoLink = document.getElementById("inputLinkFotos").value;
    let novoArquivo = document.getElementById("inputArquivo").files[0];

    let elemento = document.getElementById(selecao);

    if (!elemento) {
        console.error(`Elemento com ID '${selecao}' não encontrado.`);
        return;
    }

    if (selecao.includes("video")) {
        if (novoLink === "") {
            exibirAlerta("Preencha todos os campos para salvar!");
            return;
        }

        if (novoLink) {
            elemento.href = novoLink;
        }

        if (novoArquivo && novoArquivo.type.startsWith("image/")) {
            let reader = new FileReader();
            reader.onload = function (e) {
                elemento.style.backgroundImage = `url('${e.target.result}')`;
                elemento.style.backgroundSize = "cover";
                elemento.style.backgroundPosition = "center";
            };
            reader.readAsDataURL(novoArquivo);
        }
    } else if (selecao.includes("foto")) {
        if (novoLink) {
            elemento.src = novoLink;
        }

        if (novoArquivo && novoArquivo.type.startsWith("image/")) {
            let reader = new FileReader();
            reader.onload = function (e) {
                elemento.src = e.target.result;
            };
            reader.readAsDataURL(novoArquivo);
        }
    }

    fecharModal();
}

function exibirAlerta(mensagem) {
    const alerts = document.querySelector(".alerts");
    alerts.innerHTML = "";

    const alert = document.createElement("div");
    alert.className = "alert";
    alert.innerHTML = `
    <h1>Erro!</h1>
    <p>${mensagem}</p>
    <button class="btn-menu" onclick="esconder()">Ok</button>
  `;

    alerts.appendChild(alert);
    alerts.style.display = "flex";
}

function esconder() {
    const alerts = document.querySelector(".alerts");
    alerts.style.display = "none";
}

// JS DA HOME - ADM - FIM

// JS DO CARDAPIO - USER - INICIO

const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let estadoPopUp = null;

const Adicionais = [
    {
        Nome: "Batata e Coca Cola",
        Preco: "R$ 9,90",
        Imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPu9yVac5ZxuwfFOyDCrcW6TQR6PGh7jkB-A&s",
    },
    {
        Nome: "Batata",
        Preco: "R$ 8,90",
        Imagem: "IMGS/1738688942957-removebg.png",
    },
    {
        Nome: "Anel de Cebola",
        Preco: "R$ 11,90",
        Imagem: "IMGS/1738688943009-removebg.png",
    },
    {
        Nome: "Coca Cola",
        Preco: "R$ 5,00",
        Imagem: "https://res.cloudinary.com/piramides/image/upload/c_fill,h_564,w_395/v1/products/3716-coca-cola-lata-350ml-12un.20250131112806.png?_a=BAAAV6GX",
    },
]
function buscarLanche() {
    const inputBuscar = document.getElementById("inputBuscar").value.toLowerCase();
    const categorias = document.querySelectorAll(".categoria");
    const mensagem = document.getElementById("mensagem");
    let encontrouAlgumProduto = false;

    categorias.forEach(categoria => {
        const produtos = categoria.querySelectorAll(".produtos");
        let visibilidade = false;

        produtos.forEach(item => {
            if (item.textContent.toLowerCase().includes(inputBuscar)) {
                item.style.display = "";
                visibilidade = true;
                encontrouAlgumProduto = true;
            } else {
                item.style.display = "none";
            }
        });

        categoria.style.display = visibilidade ? "" : "none";
    });

    // Exibe a mensagem apenas se nenhum produto for encontrado
    mensagem.style.display = encontrouAlgumProduto ? "none" : "flex";
}

function popUp(nome, descricao, preco, imagem) {
    const popUps = document.querySelector(".popUps");
    popUps.innerHTML = "";

    const novaDiv = document.createElement("div");
    novaDiv.className = "popUp";

    novaDiv.innerHTML = `
        <div class="colunn-1">
          <h1 class="titulo">${nome}</h1>
          <img src="${imagem}" />
          <button onclick="addCarrinho('${nome}', '${descricao}', '${preco}', '${imagem}')">Adicionar ao Carrinho</button>
          <div id="carrinhoPopUp" class="carrinhoPopUp">
            <i class="bi bi-cart-fill"></i>
            <h2>Carrinho Atual:</h2>
            <h3 id="carrinhoDisplay">Seu Carrinho está Vazio!</h3>
          </div>
          <div id="carrinhoTotalPopUp" class="carrinhoPopUp">
            <h3>Total: R$ 0,00</h3>
          </div>
        </div>
        <div class="colunn-1">
          <h1 class="titulo">${preco}</h1>
          <p class="descricaoPopUp">${descricao}</p>
          <div id="escolhas" class="escolhas">
            <h2 id="tituloEscolhas">Tem certeza que deseja adicionar ao carrinho?</h2>
            <div id="botoes" class="botoes">
              <button id="btnConfirmacaoCarrinho" onclick="confirmacaoCarinho('${nome}', '${descricao}', '${preco}', '${imagem}')">Sim</button>
              <button id="btnRemocaoCarrinho" onclick="remocaoCarinho()">Não</button>
            </div>
          </div>
          <div id="adicionais" class="adicionais"></div>
          <button onclick="fecharBtn()">Sair</button>
        </div>
    `;

    popUps.appendChild(novaDiv);
    popUps.style.display = "flex";

    atualizarCarrinhoDisplay();
}

function addCarrinho(nome, descricao, preco, imagem) {
    const escolhas = document.getElementById("escolhas");
    escolhas.innerHTML = `
     <h2 id="tituloEscolhas">Tem certeza que deseja adicionar ao carrinho?</h2>
     <div id="botoes" class="botoes">
        <button id="btnConfirmacaoCarrinho" onclick="confirmacaoCarinho('${nome}', '${descricao}', '${preco}', '${imagem}')">Sim</button>
        <button id="btnRemocaoCarrinho" onclick="remocaoCarinho()">Não</button>
     </div>
    `;
    escolhas.style.display = "flex";
}

function remocaoCarinho() {
    const escolhas = document.getElementById("escolhas");
    escolhas.style.display = "none";
}

function confirmacaoCarinho(nome, descricao, preco, imagem) {
    const botoes = document.getElementById("botoes");
    const tituloEscolhas = document.getElementById("tituloEscolhas");
    const btnConfirmacaoCarrinho = document.getElementById("btnConfirmacaoCarrinho");
    const btnRemocaoCarrinho = document.getElementById("btnRemocaoCarrinho");

    tituloEscolhas.innerText = "Quantos deseja adicionar ao Carrinho?";

    if (btnConfirmacaoCarrinho) btnConfirmacaoCarrinho.remove();
    if (btnRemocaoCarrinho) btnRemocaoCarrinho.remove();

    const inputQuantidade = document.createElement("input");
    inputQuantidade.type = "number";
    inputQuantidade.placeholder = "0";
    inputQuantidade.id = "inputQuantidade";
    inputQuantidade.className = "inputQuantidade";
    inputQuantidade.min = "1";
    botoes.appendChild(inputQuantidade);

    const btnEnviarPopUp = document.createElement("button");
    btnEnviarPopUp.innerText = "Enviar";
    btnEnviarPopUp.id = "btnEnviarPopUp";
    botoes.appendChild(btnEnviarPopUp);

    btnEnviarPopUp.addEventListener("click", () => {
        const quantidade = parseInt(inputQuantidade.value);

        if (!quantidade || quantidade < 1) {
            const alerts = document.querySelector(".alerts");
            alerts.innerHTML = ""
            const alert = document.createElement("div");
            alert.className = "alert";
            alert.innerHTML = `
        <h1>Erro!</h1>
        <p>Você precisa adicionar pelo menos 1 item ao carrinho.</p>
        <button class="btnCardapio" onclick="esconder()">Ok</button>
      `
            alerts.appendChild(alert);
            alerts.style.display = "flex"
            return;
        }

        const carrinhoDisplay = document.getElementById("carrinhoDisplay");

        const produto = {
            Nome: nome,
            Preco: preco,
            Descricao: descricao,
            Imagem: imagem,
            Quantidade: quantidade,
            Adicionais: [],
        };

        carrinho.push(produto);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        console.log("Carrinho atualizado:", carrinho);

        carrinhoDisplay.innerText = `${nome} - ${quantidade}x`;

        // Atualizar o valor do carrinho atual no popup
        atualizarCarrinhoDisplay();

        const carrinhoPopUp = document.getElementById("carrinhoPopUp");

        let total = parseFloat(preco.replace("R$", "").trim().replace(",", ".")) * quantidade;

        const valDisplay = document.createElement("h3");
        valDisplay.innerText = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;


        tituloEscolhas.innerText = "Deseja adicionar Adicionais ao Carrinho?";

        inputQuantidade.remove();
        btnEnviarPopUp.remove();

        const btnAdicionaisSimPopUp = document.createElement("button");
        btnAdicionaisSimPopUp.innerText = "Sim";
        btnAdicionaisSimPopUp.id = "btnAdicionaisSimPopUp";
        botoes.appendChild(btnAdicionaisSimPopUp);

        btnAdicionaisSimPopUp.addEventListener("click", () => {
            escolhas.style.display = "none";

            const adicionais = document.querySelector(".adicionais");
            const adicionaisList = document.createElement("div");
            adicionaisList.className = "adicionaisList";
            adicionaisList.innerHTML = `
        <h2>Adicionais - (Escolha no Máximo 10)</h2>
        <div class="adicionaisOptions">
          ${Adicionais.map(adicional => `
            <div class="adicionalItem">
              <h3 class="tituloAdicional">${adicional.Nome}</h3>
              <img class="fotoAdicional" src="${adicional.Imagem}" alt="${adicional.Nome}" />
              <h3>${adicional.Preco}</h3>
              <input type="number" class="inputQuantidadeAdicional" value="0" min="0" max="10" data-nome="${adicional.Nome}" data-preco="${adicional.Preco}" />
            </div>
          `).join("")}
        </div>
        <button class="btnAdicionaisEnviarPopUp" id="btnAdicionaisEnviarPopUp">Enviar</button>
      `;

            adicionais.appendChild(adicionaisList);

            document.getElementById("btnAdicionaisEnviarPopUp").addEventListener("click", () => {
                adicionarAdicionais(produto);
            });
        });

        const btnAdicionaisNaoPopUp = document.createElement("button");
        btnAdicionaisNaoPopUp.innerText = "Não";
        btnAdicionaisNaoPopUp.id = "btnAdicionaisNaoPopUp";
        botoes.appendChild(btnAdicionaisNaoPopUp);

        btnAdicionaisNaoPopUp.addEventListener("click", () => {
            const alerts = document.querySelector(".alerts");
            alerts.innerHTML = "";

            const alert = document.createElement("div");
            alert.className = "alert";
            alert.innerHTML = `
          <h1>Carrinho Atualizado!</h1>
          <button class="btnCardapio" onclick="esconder()">Ok</button>
      `;
            alerts.appendChild(alert);
            alerts.style.display = "flex";

            // Obtendo a referência antes de escondê-lo
            const escolhas = document.getElementById("escolhas");

            // Escondendo antes de alterar o conteúdo
            escolhas.style.display = "none";

            // Substituindo o conteúdo corretamente
            setTimeout(() => {
                escolhas.innerHTML = `
              <h2 id="tituloEscolhas">Tem certeza que deseja adicionar ao carrinho?</h2>
              <div id="botoes" class="botoes">
                  <button id="btnConfirmacaoCarrinho" onclick="confirmacaoCarrinho('${nome}', '${descricao}', '${preco}', '${imagem}')">Sim</button>
                  <button id="btnRemocaoCarrinho" onclick="remocaoCarinho()">Não</button>
              </div>
          `;
            }); // Pequeno delay para evitar conflitos visuais
        });

        salvarEstadoPopUp(nome, descricao, preco, imagem, quantidade);
    });
}

function esconder() {
    const alerts = document.querySelector(".alerts");
    alerts.style.display = "none"
}

function adicionarAdicionais(produto) {
    const inputsAdicionais = document.querySelectorAll(".inputQuantidadeAdicional");
    let adicionaisSelecionados = [];
    let totalAdicionais = 0;

    inputsAdicionais.forEach(input => {
        const quantidade = parseInt(input.value);
        if (quantidade > 0) {
            const precoAdicional = parseFloat(input.dataset.preco.replace("R$", "").trim().replace(",", "."));
            adicionaisSelecionados.push({
                Nome: input.dataset.nome,
                Preco: precoAdicional,
                Quantidade: quantidade,
            });

            totalAdicionais += precoAdicional * quantidade;
        }
    });

    // Verificar se o total de adicionais excede 10
    const totalQuantidadeAdicionais = adicionaisSelecionados.reduce((acc, adicional) => acc + adicional.Quantidade, 0);
    if (totalQuantidadeAdicionais > 10) {
        const alerts = document.querySelector(".alerts");
        alerts.innerHTML = ""
        const alert = document.createElement("div");
        alert.className = "alert";
        alert.innerHTML = `
        <h1>Erro!</h1>
        <p>Você só pode adicionar 10 adicionais no total!.</p>
        <button class="btnCardapio" onclick="esconder()">Ok</button>
      `
        alerts.appendChild(alert);
        alerts.style.display = "flex"
        return;
    }

    produto.Adicionais = adicionaisSelecionados;

    // Calcular o total final (lanche + adicionais)
    let precoLanche = parseFloat(produto.Preco.replace("R$", "").trim().replace(",", "."));
    let totalFinal = precoLanche * produto.Quantidade + totalAdicionais;

    // Atualizar a exibição do total
    const carrinhoTotalPopUp = document.getElementById("carrinhoTotalPopUp");
    carrinhoTotalPopUp.innerHTML = `<h3>Total: R$ ${totalFinal.toFixed(2).replace(".", ",")}</h3>`;

    // Exibir os adicionais no carrinho
    const carrinhoDisplay = document.getElementById("carrinhoDisplay");
    carrinhoDisplay.innerHTML = `${produto.Nome} - ${produto.Quantidade}x<br>`;
    produto.Adicionais.forEach(adicional => {
        carrinhoDisplay.innerHTML += `${adicional.Nome} - ${adicional.Quantidade}x<br>`;
    });

    console.log("Produto atualizado com adicionais:", produto);
    const alerts = document.querySelector(".alerts");
    alerts.innerHTML = ""
    const alert = document.createElement("div");
    alert.className = "alert";
    alert.innerHTML = `
        <h1>Adicionais adicionados ao Carrinho!</h1>
        <button class="btnCardapio" onclick="esconder()">Ok</button>
      `
    alerts.appendChild(alert);
    alerts.style.display = "flex"
    escolhas.style.display = "none";

    const adicionaisList = document.querySelector(".adicionaisList");
    adicionaisList.style.display = "none";

    // Atualizar o valor do carrinho atual no popup
    atualizarCarrinhoDisplay();

    salvarEstadoPopUp(produto.Nome, produto.Descricao, produto.Preco, produto.Imagem, produto.Quantidade, produto.Adicionais);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function salvarEstadoPopUp(nome, descricao, preco, imagem, quantidade, adicionais = []) {
    estadoPopUp = { nome, descricao, preco, imagem, quantidade, adicionais };
}

function atualizarCarrinhoDisplay() {
    const carrinhoDisplay = document.getElementById("carrinhoDisplay");
    const carrinhoTotalPopUp = document.getElementById("carrinhoTotalPopUp");

    if (carrinho.length === 0) {
        carrinhoDisplay.innerText = "Seu Carrinho está Vazio!";
        carrinhoTotalPopUp.innerHTML = "<h3>Total: R$ 0,00</h3>";
        return;
    }

    let total = 0;
    carrinhoDisplay.innerHTML = "";

    carrinho.forEach(produto => {
        let totalProduto = parseFloat(produto.Preco.replace("R$", "").trim().replace(",", ".")) * produto.Quantidade;
        carrinhoDisplay.innerHTML += `${produto.Nome} - ${produto.Quantidade}x<br>`;
        produto.Adicionais.forEach(adicional => {
            totalProduto += adicional.Preco * adicional.Quantidade;
            carrinhoDisplay.innerHTML += `${adicional.Nome} - ${adicional.Quantidade}x<br>`;
        });
        total += totalProduto;
    });

    carrinhoTotalPopUp.innerHTML = `<h3>Total: R$ ${total.toFixed(2).replace(".", ",")}</h3>`;
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    window.location.href = "./carrinho.html";
}

function adicionarAdicional(button) {
    const quantidadeSpan = button.nextElementSibling.nextElementSibling;
    let quantidade = parseInt(quantidadeSpan.textContent);
    const totalAdicionais = calcularTotalAdicionais();

    if (totalAdicionais < 10) {
        quantidade++;
        quantidadeSpan.textContent = quantidade;
        const precoBase = document.querySelector(".preçoLanche p").textContent;
        calcularPrecoTotal(precoBase);
    } else {
        alert("Você só pode adicionar até 10 adicionais no total.");
    }
}

function removerAdicional(button) {
    const quantidadeSpan = button.nextElementSibling;
    let quantidade = parseInt(quantidadeSpan.textContent);
    if (quantidade > 0) {
        quantidade--;
        quantidadeSpan.textContent = quantidade;
        const precoBase = document.querySelector(".preçoLanche p").textContent;
        calcularPrecoTotal(precoBase);
    }
}

function calcularTotalAdicionais() {
    let total = 0;
    document.querySelectorAll(".adicionais .quantidade").forEach(span => {
        total += parseInt(span.textContent);
    });
    return total;
}
function fecharBtn() {
    const popUps = document.querySelector(".popUps");
    popUps.style.display = "none";
}

function voltarHome() {
    window.location.href = "./index.html"
}

function voltarPedido() {
    window.location.href = "./pedido.html"
}

function irSugestão() {
    window.location.href = "./sugestoes.html"
}

function AdicionarLanche(nome, preco, descricao, imagem) {
    let valorTotalFloat = parseFloat(preco.replace("R$", "").trim().replace(",", ".")) || 0;

    // Adiciona o valor dos adicionais selecionados
    const adicionaisSelecionados = [];
    document.querySelectorAll(".adicionais").forEach(adicionalDiv => {
        const quantidade = parseInt(adicionalDiv.querySelector(".quantidade").textContent);
        const adicionalNome = adicionalDiv.querySelector("p").textContent;
        const adicionalPreco = parseFloat(adicionalDiv.querySelector("button[data-preco]").dataset.preco.replace("R$", "").trim().replace(",", ".")) || 0;
        if (quantidade > 0) {
            valorTotalFloat += adicionalPreco * quantidade;
            adicionaisSelecionados.push({ Nome: adicionalNome, Preco: adicionalPreco, Quantidade: quantidade });
        }
    });

    const produto = {
        Nome: nome,
        Preco: `R$ ${valorTotalFloat.toFixed(2).replace(".", ",")}`,
        Descricao: descricao,
        Imagem: imagem,
        Adicionais: adicionaisSelecionados
    };
    carrinho.push(produto);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    console.log("carrinho atualizado:", carrinho);

    // Exibir alerta informando que o produto foi adicionado ao carrinho
    alert(`${nome} foi adicionado ao carrinho.`);
}

function toggleAdicional(button) {
    button.classList.toggle("selected");
    const precoBase = document.querySelector(".preçoLanche p").textContent;
    calcularPrecoTotal(precoBase);
}

function calcularPrecoTotal(precoBase) {
    let valorTotalFloat = parseFloat(precoBase.replace("R$", "").trim().replace(",", ".")) || 0;

    // Adiciona o valor dos adicionais selecionados
    document.querySelectorAll(".adicionais").forEach(adicionalDiv => {
        const quantidade = parseInt(adicionalDiv.querySelector(".quantidade").textContent);
        const adicionalPreco = parseFloat(adicionalDiv.querySelector("button[data-preco]").dataset.preco.replace("R$", "").trim().replace(",", ".")) || 0;
        valorTotalFloat += adicionalPreco * quantidade;
    });

    // Formata corretamente como moeda brasileira
    document.getElementById("ValorTotal").textContent = `R$ ${valorTotalFloat.toFixed(2).replace(".", ",")}`;
}

function exibirItensDoCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let itensHTML = "";

    carrinho.forEach(item => {
        let adicionaisHTML = "";
        item.Adicionais.forEach(adicional => {
            adicionaisHTML += `
        <p>Adicional: ${adicional.Nome} - R$ ${adicional.Preco.toFixed(2).replace(".", ",")} (x${adicional.Quantidade})</p>
      `;
        });

        itensHTML += `
      <div class="itemCarrinho" data-preco="${parseFloat(item.Preco.replace("R$", "").replace(",", "."))}">
        <p>${item.Nome} - ${item.Preco}</p>
        ${adicionaisHTML}
      </div>
    `;
    });

    itensDoCarrinho.innerHTML = itensHTML;
    atualizarPrecoTotal();
}

function btnPerfil() {
    window.location.href = "./userpage.html"
}

function btnPerfilAdm() {
    window.location.href = "./admpage.html"
}

function btnSacola() {
    window.location.href = "./carrinho.html"
}

// JS DO CARDAPIO - USER - FIM

async function enviarSugestao() {
    const texto = document.getElementById('cxText').value.trim();

    if (!texto) {
        alert("⚠️ Por favor, escreva algo.");
        return;
    }

    try {
        const response = await fetch('/Sugestao/Enviar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ descricao: texto })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ " + data.message);
            document.getElementById('cxText').value = "";
        } else {
            alert("❌ Erro: " + (data.message || "Não foi possível enviar a sugestão."));
        }

    } catch (error) {
        alert("❌ Erro na conexão com o servidor.");
        console.error(error);
    }
}