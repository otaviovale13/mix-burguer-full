using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mix_burguer_full.Models
{
    [Table("USUARIOS")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Nome { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(40)]
        public string Senha { get; set; }

        [Required]
        public bool Tipo { get; set; } // true = Admin, false = Cliente

        [StringLength(15)]
        public string? Telefone { get; set; }

        [StringLength(100)]
        public string? TelefoneLink { get; set; }

        [StringLength(50)]
        public string? Instagram { get; set; }

        [StringLength(100)]
        public string? InstagramLink { get; set; }

        [StringLength(50)]
        public string? Facebook { get; set; }

        [StringLength(100)]
        public string? FacebookLink { get; set; }

        [StringLength(20)]
        public string? Whatsapp { get; set; }

        [StringLength(100)]
        public string? WhatsappLink { get; set; }
    }
}
