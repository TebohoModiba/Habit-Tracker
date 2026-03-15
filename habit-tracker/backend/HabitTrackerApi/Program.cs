using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using HabitTrackerApi.Services;

var builder = WebApplication.CreateBuilder(args);

// ─── Firebase Setup ───────────────────────────────────────────
var firebaseKeyPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "firebase-adminsdk.json");

Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", firebaseKeyPath);

FirebaseApp.Create(new AppOptions
{
    Credential = await GoogleCredential.GetApplicationDefaultAsync()
});

FirestoreDb firestoreDb = FirestoreDb.Create("habittracker-d63f1");
builder.Services.AddSingleton(firestoreDb);

// ─── Register Services ────────────────────────────────────────
builder.Services.AddScoped<AuthService>();

// ─── Add Controllers & Swagger ────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ─── Middleware Pipeline ──────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();