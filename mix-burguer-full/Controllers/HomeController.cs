using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using mix_burguer_full.Models;
using mix_burguer_full.Data;
using Microsoft.EntityFrameworkCore;

namespace mix_burguer_full.Controllers
{
    public class HomeController : Controller
    {
        private readonly DBContext dbcontext;
        private readonly ILogger<HomeController> _logger;

        public HomeController(DBContext context, ILogger<HomeController> logger)
        {
            dbcontext = context;
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult AdmIndex()
        {
            var user = dbcontext.Usuarios.FirstOrDefault(u => u.Id == 1);
            if (user == null)
                return NotFound($"Usuário com ID 1 não encontrado.");

            ViewBag.Usuario = user; // Passa o usuário para a view e layout
            return View(user);
        }

        [HttpPost]
        public IActionResult AtualizarContato(string rede, string nome, string link)
        {
            var usuario = dbcontext.Usuarios.FirstOrDefault(u => u.Id == 1); // você pode mudar o Id depois para o usuário logado

            if (usuario == null)
                return NotFound("Usuário não encontrado.");

            switch (rede)
            {
                case "WhatsApp":
                    usuario.Whatsapp = nome;
                    usuario.WhatsappLink = link;
                    break;
                case "Instagram":
                    usuario.Instagram = nome;
                    usuario.InstagramLink = link;
                    break;
                case "Telefone":
                    usuario.Telefone = nome;
                    usuario.TelefoneLink = $"tel:{link}";
                    break;
                case "Facebook":
                    usuario.Facebook = nome;
                    usuario.FacebookLink = link;
                    break;
                default:
                    return BadRequest("Rede inválida.");
            }

            dbcontext.SaveChanges();

            return Ok("Rede social atualizada com sucesso.");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
