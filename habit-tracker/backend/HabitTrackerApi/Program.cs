using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using HabitTrackerApi.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ─── Firebase Setup ───────────────────────────────────────────
// Get the path to the service account JSON file.
// Assumes the file is in the project root (where HabitTrackerApi.csproj is)
string jsonPath = Path.Combine(AppContext.BaseDirectory, "firebase-adminsdk.json");
if (!File.Exists(jsonPath))
{
    // Try a second location: the current working directory
    jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "firebase-adminsdk.json");
    if (!File.Exists(jsonPath))
        throw new FileNotFoundException("firebase-adminsdk.json not found. Please place it in the project root and set Copy to Output Directory = Copy if newer.");
}

// Set the environment variable for Application Default Credentials
Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", jsonPath);

// Load credentials asynchronously (top-level await is allowed)
var credential = await GoogleCredential.GetApplicationDefaultAsync();

// If you need Firestore with the default project, you can also use:
FirestoreDb firestoreDb = FirestoreDb.Create("habittracker-d63f1");
builder.Services.AddSingleton(firestoreDb);

// Initialize Firebase Admin SDK (optional, for Firebase Auth etc.)
if (FirebaseApp.DefaultInstance == null)
{
    FirebaseApp.Create(new AppOptions { Credential = credential });
}

// ─── Register Services ────────────────────────────────────────
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<HabitService>();
builder.Services.AddScoped<SuggestionService>();
builder.Services.AddScoped<TokenService>();

// ─── HTTP Client (used by SuggestionService to call Grok) ─────
builder.Services.AddHttpClient();

// ─── JWT Authentication ──────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

if (string.IsNullOrEmpty(jwtKey))
    throw new InvalidOperationException("JWT Key is missing in appsettings.json");

if (string.IsNullOrEmpty(jwtIssuer))
    throw new InvalidOperationException("JWT Issuer is missing in appsettings.json");

if (string.IsNullOrEmpty(jwtAudience))
    throw new InvalidOperationException("JWT Audience is missing in appsettings.json");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// ─── Add Controllers & Swagger ────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ─── CORS (allow React Native dev server) ─────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// ─── Middleware Pipeline ──────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();