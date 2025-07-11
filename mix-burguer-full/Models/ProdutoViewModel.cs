namespace mix_burguer_full.Models
{
    public class ProdutoViewModel
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Preco { get; set; }
        public int IdCategoria { get; set; }
        // não inclui a Categoria completa aqui para evitar ciclos
    }
}
