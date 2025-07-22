using Microsoft.EntityFrameworkCore;
using mix_burguer_full.Models;
using mix_burguer_full.Data;
using Microsoft.AspNetCore.Mvc;

namespace mix_burguer_full.Controllers
{
    public class SugestaoController : Controller
    {
        private readonly DBContext _context;

        public SugestaoController(DBContext context)
        {
            _context = context;
        }

        public IActionResult Sugestao()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Enviar([FromBody] Sugestao sugestao)
        {
            if (string.IsNullOrWhiteSpace(sugestao.Descricao))
                return BadRequest("Descrição inválida.");

            sugestao.IdUsuario = 1; // temporário, substitua com id real

            _context.Sugestoes.Add(sugestao);
            _context.SaveChanges();

            return Ok(new { message = "Sugestão enviada com sucesso!" });
        }

        public IActionResult AdmSugestao()
        {
            var sugestoes = _context.Sugestoes
                .Include(s => s.Usuario)
                .ToList();

            return View(sugestoes); // ← aqui é onde o Model é enviado!
        }
    }
}
