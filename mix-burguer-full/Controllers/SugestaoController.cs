using mix_burguer_full.Data;
using mix_burguer_full.Models;
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

            // Aqui você pode ajustar para pegar o ID do usuário logado
            sugestao.IdUsuario = 1; // mockado

            _context.Sugestoes.Add(sugestao);
            _context.SaveChanges();

            return Ok(new { message = "Sugestão enviada com sucesso!" });
        }
    }
}
