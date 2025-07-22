using Microsoft.AspNetCore.Mvc;

namespace mix_burguer_full.Controllers
{
    public class SugestaoController : Controller
    {
        public IActionResult Sugestao()
        {
            return View();
        }
    }
}
