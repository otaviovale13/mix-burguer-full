using System.ComponentModel.DataAnnotations;

namespace mix_burguer_full.Models
{
    public class Sugestao
    {
        public int Id { get; set; }

        [Required]
        public int IdUsuario { get; set; }

        [Required]
        [StringLength(150)]
        public string Descricao { get; set; }

        public Usuario Usuario { get; set; }
    }
}
