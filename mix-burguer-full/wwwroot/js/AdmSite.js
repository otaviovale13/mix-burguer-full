// JS DO CARDAPIO - ADM - INICO

const Adicionais = [
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
        Imagem:
            "https://res.cloudinary.com/piramides/image/upload/c_fill,h_564,w_395/v1/products/3716-coca-cola-lata-350ml-12un.20250131112806.png?_a=BAAAV6GX",
    },
];
function buscarLanche() {
    const inputBuscar = document
        .getElementById("inputBuscar")
        .value.toLowerCase();
    const categorias = document.querySelectorAll(".categoria");
    const mensagem = document.getElementById("mensagem");
    let encontrouAlgumProduto = false;

    categorias.forEach((categoria) => {
        const produtos = categoria.querySelectorAll(".produtos");
        let visibilidade = false;

        produtos.forEach((item) => {
            // Seleciona o bloco de botões logo após o produto
            const btns = item.nextElementSibling;
            if (item.textContent.toLowerCase().includes(inputBuscar)) {
                item.style.display = "";
                if (btns && btns.classList.contains("btnsRemoveEEdit")) {
                    btns.style.display = "";
                }
                visibilidade = true;
                encontrouAlgumProduto = true;
            } else {
                item.style.display = "none";
                if (btns && btns.classList.contains("btnsRemoveEEdit")) {
                    btns.style.display = "none";
                }
            }
        });

        categoria.style.display = visibilidade ? "" : "none";
    });

    // Exibe a mensagem apenas se nenhum produto for encontrado
    mensagem.style.display = encontrouAlgumProduto ? "none" : "flex";
}

function adicionarCate() {
    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "flex";

    let options = `<option value="-1">No final</option>`;

    categoriasExistentes.forEach((categoria, index) => {
        options += `<option value="${index}">${categoria}</option>`;
    });

    modal.innerHTML = `
    <div class="popUpEdit">
      <div class="btnsInputs">
        <label>Nome da Categoria:</label>
        <input id="inputAdicionais" type="text" />
      </div>
      <div class="btnsInputs">
        <label>Posição da Categoria:</label>
        <select id="posicaoCategoria">${options}</select>
      </div>
      <div class="btnsSalvar">
        <button class="btnCardapioAriel" onclick="salvarCategoria()">Salvar</button>
        <button class="btnCardapioAriel" onclick="fecharModal()">Fechar</button>
      </div>
    </div>
  `;
}

async function salvarCategoria() {
    const nomeCategoria = document.getElementById("inputAdicionais").value.trim();
    const posicaoSelecionada = document.getElementById("posicaoCategoria").value;

    if (nomeCategoria === "") {
        exibirAlerta("O nome da categoria não pode estar vazio!");
        return;
    }

    const data = {
        nomeCategoria: nomeCategoria,
        posicao: posicaoSelecionada === "-1" ? null : Number(posicaoSelecionada)
    };

    try {
        const response = await fetch('/Cardapio/AdicionarCategoria', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            fecharModal();
            await exibirAlerta("Categoria adicionada com sucesso!", "Sucesso");
            location.reload();  // Recarrega para atualizar lista
        } else if (response.status === 409) {
            await exibirAlerta("Essa categoria já existe.");
        } else {
            const erro = await response.text();
            await exibirAlerta("Erro: " + erro);
        }
    } catch (error) {
        await exibirAlerta("Erro na comunicação com o servidor.");
    }
}
function exibirAlerta(mensagem, titulo) {
    return new Promise((resolve) => {
        const alerts = document.querySelector(".alerts");
        alerts.innerHTML = "";

        const alert = document.createElement("div");
        alert.className = "alert";
        alert.innerHTML = `
            <h1>${titulo}</h1>
            <p>${mensagem}</p>
            <button class="btn-menu">Ok</button>
        `;

        alerts.appendChild(alert);
        alerts.style.display = "flex";

        alert.querySelector("button").addEventListener("click", () => {
            alerts.style.display = "none";
            alerts.innerHTML = "";
            resolve();
        });
    });
}

function removerCate() {
    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "flex";

    const options = categoriasExistentes.map(c => `<option value="${c}">${c}</option>`).join("");

    modal.innerHTML = `
        <div class="popUpEdit">
            <div class="btnsInputs">
                <h1>Deseja excluir qual Categoria?</h1>
                <select id="selectCate">
                    <option value="" disabled selected>Selecione uma Categoria</option>
                    ${options}
                </select>
            </div>
            <div class="btnsSalvar">
                <button class="btnCardapioAriel" onclick="confirmarRemocaoCate()">Sim</button>
                <button class="btnCardapioAriel" onclick="fecharModal()">Não</button>
            </div>
        </div>
    `;
}

async function confirmarRemocaoCate() {
    const selectCate = document.getElementById("selectCate");
    const categoriaSelecionada = selectCate.value;

    if (!categoriaSelecionada) {
        exibirAlerta("Selecione uma categoria para remover.");
        return;
    }

    try {
        const response = await fetch("/Cardapio/RemoverCategoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoriaSelecionada)
        });

        if (response.ok) {
            fecharModal();
            await exibirAlerta("Categoria removida com sucesso!", "Sucesso");
            location.reload();  // Recarrega para atualizar lista
        } else {
            const erro = await response.text();
            exibirAlerta("Erro: " + erro);
        }
    } catch (error) {
        exibirAlerta("Erro ao se comunicar com o servidor.");
    }
}

function editarCate() {
    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "flex";

    modal.innerHTML = `
    <div class="popUpEdit">
      <h1 class="titulo">Editar Categoria</h1>
      <div class="btnsInputs">
        <h1>Deseja editar qual Categoria?</h1>
        <select id="selectCateEdit" onchange="preencherInputEditCate()">
            <option value="" disabled selected>Selecione uma Categoria</option>
            ${categoriasExistentes
            .map(categoria => `<option value="${categoria}">${categoria}</option>`)
            .join("")}
        </select>
      </div>
      <div class="btnsInputs">
        <label>Nome:</label>
        <input id="inputEditCate" type="text" />
      </div>
      <div class="btnsSalvar">
        <button class="btnCardapioAriel" onclick="salvarNovaCategoria()" disabled>Salvar</button>
        <button class="btnCardapioAriel" onclick="fecharModal()">Cancelar</button>
      </div>
    </div>
  `;
}

function preencherInputEditCate() {
    const selectCateEdit = document.getElementById("selectCateEdit");
    const categoriaSelecionadaEdit = selectCateEdit.value;
    const inputEditCate = document.getElementById("inputEditCate");
    const botaoSalvar = document.querySelector(".btnsSalvar button");

    if (categoriaSelecionadaEdit) {
        inputEditCate.value = categoriaSelecionadaEdit;
        botaoSalvar.disabled = false;
    } else {
        inputEditCate.value = "";
        botaoSalvar.disabled = true;
    }
}

async function salvarNovaCategoria() {
    const selectCateEdit = document.getElementById("selectCateEdit");
    const categoriaSelecionadaEdit = selectCateEdit.value;
    const novoNomeCategoria = document.getElementById("inputEditCate").value.trim();

    if (novoNomeCategoria === "") {
        exibirAlerta("O campo do nome deve estar preenchido!");
        return;
    }

    if (!categoriaSelecionadaEdit) {
        exibirAlerta("Selecione uma categoria para editar.");
        return;
    }

    if (categoriaSelecionadaEdit === novoNomeCategoria) {
        exibirAlerta("O novo nome é igual ao antigo.");
        return;
    }

    const data = {
        nomeAntigo: categoriaSelecionadaEdit,
        nomeNovo: novoNomeCategoria
    };

    try {
        const response = await fetch("/Cardapio/EditarCategoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            fecharModal();
            await exibirAlerta("Categoria atualizada com sucesso!", "Sucesso");
            location.reload();  // Recarrega para atualizar lista
        } else {
            const erro = await response.text();
            exibirAlerta("Erro: " + erro);
        }
    } catch (error) {
        exibirAlerta("Erro ao se comunicar com o servidor.");
    }
}
function esconder() {
    const alerts = document.querySelector(".alerts");
    alerts.style.display = "none";
}

function removerItemDestaques(categoria, nomeItem) {
    // Seleciona apenas os produtos dentro da seção de destaques
    const destaquesContainer = document.getElementById("destaques");
    const destaques = destaquesContainer.querySelectorAll('.produtos');

    if (destaques.length <= 1) {
        exibirAlerta("Não é possível remover o último item dos destaques.", "Erro");
        return;
    }

    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "flex";
    modal.innerHTML = `
      <div class="popUpEdit">
          <div class="btnsInputs">
              <h1>Tem certeza que deseja remover "${nomeItem}" dos destaques?</h1>
          </div>
          <div class="btnsSalvar">
              <button class="btnCardapioAriel" onclick="confirmarRemocaoDestaque('${nomeItem}')">Sim</button>
              <button class="btnCardapioAriel" onclick="fecharModal()">Não</button>
          </div>
      </div>
    `;
}

async function confirmarRemocaoDestaque(nomeItem) {
    try {
        const res = await fetch('/Cardapio/RemoverDestaque', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nomeItem)
        });

        if (res.ok) {
            fecharModal();
            await exibirAlerta("Item removido dos Destaques com sucesso!", "Sucesso");
            location.reload();
        } else {
            const msg = await res.text();
            alert("Erro: " + msg);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao remover dos destaques.");
    }
}

async function adicionarProdutoDestaque(categoria) {
    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "flex";

    const response = await fetch('/Cardapio/ProdutosDisponiveisParaDestaque');
    const produtos = await response.json();

    if (!produtos || produtos.length === 0) {
        modal.innerHTML = `
            <div class="popUpEdit">
                <h2 class="text-center">Nenhum produto disponível para adicionar aos destaques.</h2>
                <div class="btnsSalvar">
                    <button class="btnCardapioAriel" onclick="fecharModal()">Fechar</button>
                </div>
            </div>
        `;
        return;
    }

    let options = produtos.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');

    modal.innerHTML = `
        <div class="popUpEdit">
            <div class="btnsInputs">
                <label>Selecione um produto para adicionar aos destaques:</label>
                <select id="selectProdutoDestaque">${options}</select>
            </div>
            <div class="btnsSalvar">
                <button class="btnCardapioAriel" onclick="confirmarAdicionarDestaque()">Adicionar</button>
                <button class="btnCardapioAriel" onclick="fecharModal()">Fechar</button>
            </div>
        </div>
    `;
}

async function confirmarAdicionarDestaque() {
    const select = document.getElementById("selectProdutoDestaque");
    const produtoId = parseInt(select.value);

    if (isNaN(produtoId)) {
        exibirAlerta("Produto inválido.", "Erro");
        return;
    }

    const res = await fetch('/Cardapio/AdicionarDestaque', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoId)
    });

    if (res.ok) {
        fecharModal();
        await exibirAlerta("Produto adicionado aos destaques com sucesso!", "Sucesso");
        location.reload();
    } else {
        const msg = await res.text();
        exibirAlerta(msg, "Erro");
    }
}

function removerItem(categoria, nomeItem) {
    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "flex";
    modal.innerHTML = `
      <div class="popUpEdit">
          <div class="btnsInputs">
              <h1>Tem certeza que deseja remover "${nomeItem}"?</h1>
          </div>
          <div class="btnsSalvar">
              <button class="btnCardapioAriel" onclick="confirmarRemocao('${categoria}', '${nomeItem}')">Sim</button>
              <button class="btnCardapioAriel" onclick="fecharModal()">Não</button>
          </div>
      </div>
  `;
}

async function confirmarRemocao(categoria, nomeItem) {
    const res = await fetch('/Cardapio/RemoverProduto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nomeProduto: nomeItem,
            nomeCategoria: categoria
        })
    });

    if (res.ok) {
        fecharModal();
        await exibirAlerta("Produto removido com sucesso!", "Sucesso");
        location.reload();
    } else {
        const msg = await res.text();
        exibirAlerta("Erro ao remover: " + msg, "Erro");
    }
}

function fecharModal() {
    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "none";
}

function editarItem(categoria, nomeItem, descricaoItem, precoItem, idProduto) {
    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "flex";

    modal.innerHTML = `
        <div class="popUpEdit">
            <h1 class="titulo">Editar "${nomeItem}"</h1>
            <div class="btnsInputs">
                <label>Nome:</label>
                <input id="inputNovoNome" type="text" value="${nomeItem}" />
            </div>
            <div class="btnsInputs">
                <label>Descrição:</label>
                <textarea id="inputNovaDescricao" class="inputNovaDescricao">${descricaoItem}</textarea>
            </div>
            <div class="btnsInputs">
                <label>Preço:</label>
                <input id="inputNovoPreco" type="text" value="${precoItem}" />
            </div>
            <div class="btnsSalvar">
                <button class="btnCardapioAriel" onclick="confirmarEdicao('${categoria}', ${idProduto})">Salvar</button>
                <button class="btnCardapioAriel" onclick="fecharModal()">Cancelar</button>
            </div>
        </div>
    `;
}

async function confirmarEdicao(categoria, idProduto) {
    const novoNome = document.getElementById("inputNovoNome").value.trim();
    const novaDescricao = document.getElementById("inputNovaDescricao").value.trim();
    const novoPreco = document.getElementById("inputNovoPreco").value.trim();

    if (!novoNome || !novaDescricao || !novoPreco) {
        await exibirAlerta("Todos os campos devem ser preenchidos!", "Erro");
        return;
    }

    // Validar preço no formato "R$ 10,00"
    const precoValido = /^R\$ ?\d+(\,\d{2})?$/.test(novoPreco);
    if (!precoValido) {
        await exibirAlerta("O campo preço deve estar no formato correto (ex: R$ 10,00)!", "Erro");
        return;
    }

    try {
        const response = await fetch('/Cardapio/EditarProduto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Id: idProduto,
                NomeNovo: novoNome,
                DescricaoNova: novaDescricao,
                PrecoNovo: novoPreco
            })
        });

        if (response.ok) {
            fecharModal();
            await exibirAlerta("Produto atualizado com sucesso!", "Sucesso");
            location.reload(); // Recarrega a página para mostrar atualizações
        } else {
            const erro = await response.text();
            await exibirAlerta("Erro: " + erro, "Erro");
        }
    } catch (error) {
        await exibirAlerta("Erro na comunicação com o servidor.", "Erro");
    }
}

function adicionarProduto(categoria) {
    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "flex";

    modal.innerHTML = `
    <div class="popUpEdit">
      <h1>Adicionar Produto à Categoria "${categoria}"</h1>
      <div class="btnsInputs">
        <label>Nome do Produto:</label>
        <input id="inputNomeProduto" type="text" />
      </div>
      <div class="btnsInputs">
        <label>Descrição:</label>
        <textarea id="inputDescricaoProduto"></textarea>
      </div>
      <div class="btnsInputs">
        <label>Preço:</label>
        <input id="inputPrecoProduto" type="text" />
      </div>
      <div class="btnsSalvar">
        <button class="btnCardapioAriel" onclick="salvarProduto('${categoria}')">Salvar</button>
        <button class="btnCardapioAriel" onclick="fecharModal()">Cancelar</button>
      </div>
    </div>
  `;
}

async function salvarProduto(categoria) {
    const nomeProduto = document.getElementById("inputNomeProduto").value.trim();
    const descricaoProduto = document.getElementById("inputDescricaoProduto").value.trim();
    const precoProduto = document.getElementById("inputPrecoProduto").value.trim();

    if (!nomeProduto || !descricaoProduto || !precoProduto) {
        exibirAlerta("Todos os campos devem ser preenchidos!", "Erro");
        return;
    }

    const precoValido = /^R\$ ?\d+(\,\d{2})?$/.test(precoProduto);
    if (!precoValido) {
        exibirAlerta("O campo preço deve estar no formato correto (ex: R$ 10,00)!", "Erro");
        return;
    }

    const novoProduto = {
        Nome: nomeProduto,
        Descricao: descricaoProduto,
        Preco: precoProduto,
        NomeCategoria: categoria
    };

    try {
        const response = await fetch('/Cardapio/AdicionarProduto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoProduto)
        });

        if (response.ok) {
            fecharModal();
            await exibirAlerta("Produto atualizado com sucesso!", "Sucesso");
            location.reload(); // Recarrega a página para mostrar atualizações
        } else {
            fecharModal();
            await exibirAlerta("Produto criado com sucesso!", "Sucesso");
            location.reload(); // Recarrega a página para mostrar atualizações
        }
    } catch (error) {
        alert("Erro na requisição: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarCategorias();
    criarModal();
});

function fecharModal() {
    const modal = document.getElementById("popUpsAdicionar");
    modal.style.display = "none";
}

const carrinho = [];

function popUp(nome, descricao, preco, imagem) {
    const popUps = document.querySelector(".popUps");
    popUps.innerHTML = "";

    const novaDiv = document.createElement("div");
    novaDiv.className = "popUp";

    novaDiv.innerHTML = `
    <div class="colunn-1">
        <h1 class="titulo">${nome}</h1>
        <img src="${imagem}" />
        <button onclick="addCarrinho()">Adicionar ao Carrinho</button>
        <div id="carrinhoPopUp" class="carrinhoPopUp">
          <i class="bi bi-cart-fill"></i>
          <h2>Carrinho Atual:</h2>
          <h3 id="carrinhoDisplay">Seu Carrinho está Vazio!</h3>
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

    // Inicializa o valor total com o preço base do lanche
    calcularPrecoTotal(preco);
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
        const alerts = document.querySelector(".alerts");
        alerts.innerHTML = "";
        const alert = document.createElement("div");
        alert.className = "alert";
        alert.innerHTML = `
        <h1>Erro!</h1>
        <p>Você só pode adicionar até 10 adicionais no total.</p>
        <button class="btn-menu" onclick="esconder()">Ok</button>
      `;
        alerts.appendChild(alert);
        alerts.style.display = "flex";
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
    document.querySelectorAll(".adicionais .quantidade").forEach((span) => {
        total += parseInt(span.textContent);
    });
    return total;
}

function fecharBtn() {
    const popUps = document.querySelector(".popUps");
    popUps.style.display = "none";
}

function AdicionarLanche(nome, preco, descricao, imagem) {
    let valorTotalFloat =
        parseFloat(preco.replace("R$", "").trim().replace(",", ".")) || 0;

    // Adiciona o valor dos adicionais selecionados
    const adicionaisSelecionados = [];
    document.querySelectorAll(".adicionais").forEach((adicionalDiv) => {
        const quantidade = parseInt(
            adicionalDiv.querySelector(".quantidade").textContent
        );
        const adicionalNome = adicionalDiv.querySelector("p").textContent;
        const adicionalPreco =
            parseFloat(
                adicionalDiv
                    .querySelector("button[data-preco]")
                    .dataset.preco.replace("R$", "")
                    .trim()
                    .replace(",", ".")
            ) || 0;
        if (quantidade > 0) {
            valorTotalFloat += adicionalPreco * quantidade;
            adicionaisSelecionados.push({
                Nome: adicionalNome,
                Preco: adicionalPreco,
                Quantidade: quantidade,
            });
        }
    });

    const produto = {
        Nome: nome,
        Preco: `R$ ${valorTotalFloat.toFixed(2).replace(".", ",")}`,
        Descricao: descricao,
        Imagem: imagem,
        Adicionais: adicionaisSelecionados,
    };
    carrinho.push(produto);

    console.log("carrinho atualizado:", carrinho);

    // Exibir alerta informando que o produto foi adicionado ao carrinho
    const alerts = document.querySelector(".alerts");
    alerts.innerHTML = "";
    const alert = document.createElement("div");
    alert.className = "alert";
    alert.innerHTML = `
        <h1>Erro!</h1>
        <p>${nome} foi adicionado ao carrinho.</p>
        <button class="btn-menu" onclick="esconder()">Ok</button>
      `;
    alerts.appendChild(alert);
    alerts.style.display = "flex";
}

function calcularPrecoTotal(precoBase) {
    let valorTotalFloat =
        parseFloat(precoBase.replace("R$", "").trim().replace(",", ".")) || 0;

    // Adiciona o valor dos adicionais selecionados
    document.querySelectorAll(".adicionais").forEach((adicionalDiv) => {
        const quantidade = parseInt(
            adicionalDiv.querySelector(".quantidade").textContent
        );
        const adicionalPreco =
            parseFloat(
                adicionalDiv
                    .querySelector("button[data-preco]")
                    .dataset.preco.replace("R$", "")
                    .trim()
                    .replace(",", ".")
            ) || 0;
        valorTotalFloat += adicionalPreco * quantidade;
    });

    // Formata corretamente como moeda brasileira
    document.getElementById("ValorTotal").textContent = `R$ ${valorTotalFloat
        .toFixed(2)
        .replace(".", ",")}`;
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    window.location.href = "./carrinho.html";
}

// JS DO CARDAPIO - ADM - FIM