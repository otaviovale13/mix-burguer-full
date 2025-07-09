using Microsoft.EntityFrameworkCore;
using mix_burguer_full.Models;

namespace mix_burguer_full.Data
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Destaque> Destaques { get; set; }
    }
}