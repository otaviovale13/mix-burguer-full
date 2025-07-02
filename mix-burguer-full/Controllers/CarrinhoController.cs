using Microsoft.AspNetCore.Mvc;
using mix_burguer_full.Models;
using System.Collections.Generic;

namespace mix_burguer_full.Controllers
{
    public class CarrinhoController : Controller
    {
        public IActionResult Index()
        {
            // Exemplo de dados fictícios para teste
            var model = new CarrinhoViewModel
            {
                Produtos = new List<ProdutoViewModel>
                {
                    new ProdutoViewModel
                    {
                        Index = 0,
                        Nome = "Hambúrguer Clássico",
                        Imagem = "/IMGS/hamburguer-classico.png",
                        Quantidade = 1,
                        PrecoUnitario = 20.00m,
                        TotalItem = 22.00m,
                        Adicionais = new List<AdicionalViewModel>
                        {
                            new AdicionalViewModel { Nome = "Queijo Extra", Preco = 2.00m, Quantidade = 1 }
                        }
                    }
                },
                TotalComAdicionais = 22.00m
            };
            return View("~/Views/carrinho.cshtml", model);
        }
    }
}
