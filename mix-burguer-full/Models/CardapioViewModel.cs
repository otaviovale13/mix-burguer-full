// Models/ViewModels/CardapioViewModel.cs
using System.Collections.Generic;

namespace mix_burguer_full.Models.ViewModels
{
    public class CardapioViewModel
    {
        public List<Categoria> Categorias { get; set; }
        public List<Produto> Destaques { get; set; }
    }
}
