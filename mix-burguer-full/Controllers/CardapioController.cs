using Microsoft.AspNetCore.Mvc;

namespace mix_burguer_full.Controllers
{
    public class CardapioController : Controller
    {
        public IActionResult Cardapio()
        {
            return View();
        }
    }
}
