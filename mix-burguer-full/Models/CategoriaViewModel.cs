namespace mix_burguer_full.Models
{
    public class CategoriaViewModel
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public List<ProdutoViewModel> Produtos { get; set; }
    }
}
