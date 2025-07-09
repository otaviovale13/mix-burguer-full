using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mix_burguer_full.Data;
using mix_burguer_full.Models.ViewModels;

namespace mix_burguer_full.Controllers
{
    public class CardapioController : Controller
    {
        private readonly DBContext _context;

        public CardapioController(DBContext context)
        {
            _context = context;
        }

        public IActionResult Cardapio()
        {
            var categorias = _context.Categorias
                .Include(c => c.Produtos)
                .ToList();

            var destaques = _context.Produtos
                .Include(p => p.Categoria)
                .Where(p => p.IdDestaque == 1) // ou o valor que significa 'destacado'
                .ToList();

            var viewModel = new CardapioViewModel
            {
                Categorias = categorias,
                Destaques = destaques
            };

            return View(viewModel);
        }

        public IActionResult AdmCardapio()
        {
            return View();
        }
    }
}