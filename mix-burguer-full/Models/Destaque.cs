using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mix_burguer_full.Models
{
    [Table("DESTAQUES")]
    public class Destaque
    {
        public int Id { get; set; }

        public int IdProduto { get; set; }

        [ForeignKey("IdProduto")]
        public Produto Produto { get; set; }

    }
}
