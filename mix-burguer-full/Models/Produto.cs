using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mix_burguer_full.Models
{
    [Table("PRODUTOS")]
    public class Produto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nome { get; set; }

        [Required]
        public string Descricao { get; set; }

        [Required]
        public string Preco { get; set; }

        public int IdCategoria { get; set; }

        [ForeignKey("IdCategoria")]
        public Categoria Categoria { get; set; }

        public int? IdDestaque { get; set; }

        [ForeignKey("IdDestaque")]
        public Destaque Destaque { get; set; }
    }
}
