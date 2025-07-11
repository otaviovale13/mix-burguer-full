using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mix_burguer_full.Data;
using mix_burguer_full.Models;
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

        private async Task NormalizarOrdemCategoriasAsync()
        {
            var todas = await _context.Categorias
                .OrderBy(c => c.Ordem)
                .ThenBy(c => c.Id)
                .ToListAsync();

            for (int i = 0; i < todas.Count; i++)
            {
                todas[i].Ordem = i;
            }

            await _context.SaveChangesAsync();
        }

        public IActionResult Cardapio()
        {
            var categorias = _context.Categorias
                .Include(c => c.Produtos)
                .ToList();

            var destaques = _context.Destaques
                .Include(d => d.Produto)
                .ThenInclude(p => p.Categoria)
                .Select(d => d.Produto)
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
            var categorias = _context.Categorias
                .Include(c => c.Produtos)
                .OrderBy(c => c.Ordem)
                .ThenBy(c => c.Id)
                .ToList();

            var destaques = _context.Destaques
                .Include(d => d.Produto)
                .ThenInclude(p => p.Categoria)
                .Select(d => d.Produto)
                .ToList();

            var viewModel = new CardapioViewModel
            {
                Categorias = categorias,
                Destaques = destaques
            };

            return View(viewModel);
        }

        public class CategoriaCreateModel
        {
            public string NomeCategoria { get; set; }
            public int? Posicao { get; set; } // null = final
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarCategoria([FromBody] CategoriaCreateModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.NomeCategoria))
                return BadRequest("Nome da categoria não pode estar vazio.");

            var existe = await _context.Categorias.AnyAsync(c => c.Nome == model.NomeCategoria);
            if (existe)
                return Conflict("Categoria já existe.");

            // ✅ Normaliza ordens antes de modificar posições
            await NormalizarOrdemCategoriasAsync();

            if (model.Posicao.HasValue)
            {
                var categoriasParaAtualizar = await _context.Categorias
                    .Where(c => c.Ordem >= model.Posicao.Value)
                    .ToListAsync();

                foreach (var c in categoriasParaAtualizar)
                {
                    c.Ordem++;
                }

                await _context.SaveChangesAsync(); // Salva antes de adicionar a nova
            }

            var novaCategoria = new Categoria
            {
                Nome = model.NomeCategoria,
                Ordem = model.Posicao ?? await _context.Categorias.MaxAsync(c => (int?)c.Ordem) + 1 ?? 0
            };

            _context.Categorias.Add(novaCategoria);
            await _context.SaveChangesAsync();

            return Ok(novaCategoria);
        }

        [HttpPost]
        public async Task<IActionResult> RemoverCategoria([FromBody] string nomeCategoria)
        {
            if (string.IsNullOrWhiteSpace(nomeCategoria))
                return BadRequest("Nome inválido.");

            var categoria = await _context.Categorias
                .Include(c => c.Produtos)
                .FirstOrDefaultAsync(c => c.Nome == nomeCategoria);

            if (categoria == null)
                return NotFound("Categoria não encontrada.");

            _context.Produtos.RemoveRange(categoria.Produtos); // se quiser excluir produtos
            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return Ok();
        }

        public class CategoriaEditModel
        {
            public string NomeAntigo { get; set; }
            public string NomeNovo { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> EditarCategoria([FromBody] CategoriaEditModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.NomeAntigo) || string.IsNullOrWhiteSpace(model.NomeNovo))
                return BadRequest("Dados inválidos.");

            if (model.NomeAntigo == model.NomeNovo)
                return BadRequest("Os nomes são iguais.");

            var categoria = await _context.Categorias.FirstOrDefaultAsync(c => c.Nome == model.NomeAntigo);
            if (categoria == null)
                return NotFound("Categoria não encontrada.");

            var existeNomeNovo = await _context.Categorias.AnyAsync(c => c.Nome == model.NomeNovo);
            if (existeNomeNovo)
                return Conflict("Já existe uma categoria com esse nome.");

            categoria.Nome = model.NomeNovo;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> RemoverDestaque([FromBody] string nomeProduto)
        {
            if (string.IsNullOrWhiteSpace(nomeProduto))
                return BadRequest("Nome do produto inválido.");

            var totalDestaques = await _context.Destaques.CountAsync();
            if (totalDestaques <= 1)
                return BadRequest("Não é possível remover o último item dos destaques.");

            var destaque = await _context.Destaques
                .Include(d => d.Produto)
                .FirstOrDefaultAsync(d => d.Produto.Nome == nomeProduto);

            if (destaque == null)
                return NotFound("Produto não está nos destaques.");

            _context.Destaques.Remove(destaque);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public IActionResult ProdutosDisponiveisParaDestaque()
        {
            var produtosNosDestaques = _context.Destaques
                .Select(d => d.IdProduto)
                .ToList();

            var produtosDisponiveis = _context.Produtos
                .Where(p => !produtosNosDestaques.Contains(p.Id))
                .Select(p => new
                {
                    p.Id,
                    p.Nome
                })
                .ToList();

            return Json(produtosDisponiveis);
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarDestaque([FromBody] int idProduto)
        {
            var produto = await _context.Produtos
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.Id == idProduto);

            if (produto == null)
                return NotFound("Produto não encontrado.");

            var jaEsta = await _context.Destaques.AnyAsync(d => d.IdProduto == idProduto);
            if (jaEsta)
                return Conflict("Produto já está nos destaques.");

            var destaque = new Destaque
            {
                IdProduto = idProduto
            };

            _context.Destaques.Add(destaque);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> RemoverProduto([FromBody] RemoverProdutoModel model)
        {
            if (string.IsNullOrWhiteSpace(model.NomeProduto) || string.IsNullOrWhiteSpace(model.NomeCategoria))
                return BadRequest("Dados inválidos.");

            var produto = await _context.Produtos
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.Nome == model.NomeProduto && p.Categoria.Nome == model.NomeCategoria);

            if (produto == null)
                return NotFound("Produto não encontrado.");

            // Se estiver nos destaques, remover também de lá
            var destaque = await _context.Destaques.FirstOrDefaultAsync(d => d.IdProduto == produto.Id);
            if (destaque != null)
                _context.Destaques.Remove(destaque);

            var categoria = produto.Categoria;

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            // Verifica se a categoria ficou vazia após a remoção
            var aindaTemProdutos = await _context.Produtos.AnyAsync(p => p.IdCategoria == categoria.Id);
            if (!aindaTemProdutos)
            {
                _context.Categorias.Remove(categoria);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        public class RemoverProdutoModel
        {
            public string NomeProduto { get; set; }
            public string NomeCategoria { get; set; }
        }

        public class ProdutoEditModel
        {
            public int Id { get; set; }
            public string NomeNovo { get; set; }
            public string DescricaoNova { get; set; }
            public string PrecoNovo { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> EditarProduto([FromBody] ProdutoEditModel model)
        {
            if (model == null || model.Id <= 0
                || string.IsNullOrWhiteSpace(model.NomeNovo)
                || string.IsNullOrWhiteSpace(model.DescricaoNova)
                || string.IsNullOrWhiteSpace(model.PrecoNovo))
            {
                return BadRequest("Dados inválidos.");
            }

            // Regex para validar o preço no formato brasileiro "R$ 10,00"
            var precoValido = System.Text.RegularExpressions.Regex.IsMatch(model.PrecoNovo, @"^R\$ ?\d+(\,\d{2})?$");
            if (!precoValido)
            {
                return BadRequest("O campo preço deve estar no formato correto (ex: R$ 10,00).");
            }

            var produto = await _context.Produtos.FindAsync(model.Id);
            if (produto == null)
                return NotFound("Produto não encontrado.");

            // Verificar se já existe outro produto com o novo nome (se quiser evitar nomes duplicados)
            var nomeEmUso = await _context.Produtos
                .AnyAsync(p => p.Nome == model.NomeNovo && p.Id != model.Id);
            if (nomeEmUso)
                return Conflict("Já existe um produto com esse nome.");

            produto.Nome = model.NomeNovo;
            produto.Descricao = model.DescricaoNova;
            produto.Preco = model.PrecoNovo;

            await _context.SaveChangesAsync();

            return Ok();
        }

        public class ProdutoCreateModel
        {
            public string Nome { get; set; }
            public string Descricao { get; set; }
            public string Preco { get; set; }
            public string NomeCategoria { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarProduto([FromBody] ProdutoCreateModel model)
        {
            if (model == null
                || string.IsNullOrWhiteSpace(model.Nome)
                || string.IsNullOrWhiteSpace(model.Descricao)
                || string.IsNullOrWhiteSpace(model.Preco)
                || string.IsNullOrWhiteSpace(model.NomeCategoria))
            {
                return BadRequest("Dados incompletos.");
            }

            // Validar preço no formato "R$ 10,00"
            if (!System.Text.RegularExpressions.Regex.IsMatch(model.Preco, @"^R\$ ?\d+(\,\d{2})?$"))
            {
                return BadRequest("Preço inválido, deve estar no formato R$ 10,00");
            }

            // Buscar categoria pelo nome
            var categoria = await _context.Categorias.FirstOrDefaultAsync(c => c.Nome == model.NomeCategoria);
            if (categoria == null)
            {
                return NotFound("Categoria não encontrada.");
            }

            // Verificar se já existe produto com o mesmo nome na categoria
            var existeProduto = await _context.Produtos.AnyAsync(p => p.Nome == model.Nome && p.IdCategoria == categoria.Id);
            if (existeProduto)
            {
                return Conflict("Já existe um produto com esse nome nessa categoria.");
            }

            var novoProduto = new Produto
            {
                Nome = model.Nome,
                Descricao = model.Descricao,
                Preco = model.Preco,
                IdCategoria = categoria.Id
            };

            _context.Produtos.Add(novoProduto);
            await _context.SaveChangesAsync();

            return Ok(novoProduto);
        }
    }
}