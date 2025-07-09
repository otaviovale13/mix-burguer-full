using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mix_burguer_full.Models
{
    [Table("DESTAQUES")]
    public class Destaque
    {
        [Key]
        public int Id { get; set; }

        public ICollection<Produto> Produtos { get; set; }
    }
}
