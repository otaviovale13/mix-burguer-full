using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mix_burguer_full.Models
{
    [Table("CATEGORIAS")]
    public class Categoria
    {
        public int Id { get; set; }
        public string Nome { get; set; }

        // Adicione essa propriedade
        public int Ordem { get; set; } = 0;

        // Outras propriedades, como lista de Produtos
        public ICollection<Produto> Produtos { get; set; }
    }
}
