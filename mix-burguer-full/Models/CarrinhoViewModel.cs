using System.Collections.Generic;

namespace mix_burguer_full.Models
{
    public class CarrinhoViewModel
    {
        public List<ProdutoViewModel> Produtos { get; set; } = new();
        public decimal TotalComAdicionais { get; set; }
    }

    public class ProdutoViewModel
    {
        public int Index { get; set; }
        public string Nome { get; set; }
        public string Imagem { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }
        public List<AdicionalViewModel> Adicionais { get; set; } = new();
        public decimal TotalItem { get; set; }
    }

    public class AdicionalViewModel
    {
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public int Quantidade { get; set; }
    }
}
