using Microsoft.EntityFrameworkCore;
using mix_burguer_full.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Adiciona o DBContext como um serviço da aplicação.
builder.Services.AddDbContext<DBContext>(options => // Configura o Entity Framework para usar SQL Server como provedor de banco de dados.
    options.UseSqlServer(builder.Configuration.GetConnectionString("strConn"))); // Pega a string de conexão chamada "strConn" do arquivo appsettings.json.

var app = builder.Build();

// oi

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Sugestao}/{action=AdmSugestao}/{id?}")
    .WithStaticAssets();


app.Run();
