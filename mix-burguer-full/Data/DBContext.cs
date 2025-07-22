using Microsoft.EntityFrameworkCore;
using mix_burguer_full.Models;

namespace mix_burguer_full.Data
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Destaque>()
                .HasOne(d => d.Produto)
                .WithMany() // ou .WithMany(p => p.Destaques) se quiser coleção
                .HasForeignKey(d => d.IdProduto)
                .OnDelete(DeleteBehavior.Cascade); // opcional
        }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Destaque> Destaques { get; set; }
        public DbSet<Sugestao> Sugestoes { get; set; }

    }
}