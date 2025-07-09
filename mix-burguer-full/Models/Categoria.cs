using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mix_burguer_full.Models
{
    [Table("CATEGORIAS")]
    public class Categoria
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nome { get; set; }

        public ICollection<Produto> Produtos { get; set; } = new List<Produto>();
    }
}
