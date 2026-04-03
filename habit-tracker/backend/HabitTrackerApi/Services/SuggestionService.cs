using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Google.Cloud.Firestore;
using HabitTrackerApi.Models;
using HabitTrackerApi.Models.DTOs;

namespace HabitTrackerApi.Services
{
    public class SuggestionService
    {
        private readonly FirestoreDb _db;
        private readonly HttpClient _httpClient;
        private readonly string _grokApiKey;

        private const string GrokEndpoint = "https://api.x.ai/v1/chat/completions";
        private const string GrokModel    = "grok-3-latest";
        private const string HabitsCollection = "habits";

        public SuggestionService(FirestoreDb db, IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _db         = db;
            _httpClient = httpClientFactory.CreateClient();
            _grokApiKey = config["Grok:ApiKey"] ?? throw new InvalidOperationException("Grok API key not configured.");
        }

        public async Task<SuggestionResponseDto> GetSuggestionsAsync(string userId)
        {
            // 1. Fetch all habits for this user
            Query query = _db.Collection(HabitsCollection).WhereEqualTo("UserId", userId);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();

            var habits = new List<Habit>();
            foreach (DocumentSnapshot doc in snapshot.Documents)
            {
                var h = doc.ConvertTo<Habit>();
                h.HabitId = doc.Id;
                habits.Add(h);
            }

            // 2. Build a context summary for the prompt
            string habitContext = BuildHabitContext(habits);

            // 3. Build Grok prompt
            string prompt = $"""
                You are a helpful habit coach. Analyse the user's current habits and patterns below, 
                then suggest 3 new habits that would complement what they are already doing.
                
                For each suggestion, respond with ONLY a JSON array (no markdown, no extra text) in this format:
                [
                  {{
                    "title": "Habit title",
                    "description": "Why this habit would help and how to do it",
                    "frequency": "daily or weekly",
                    "targetCount": 1
                  }}
                ]

                User's current habit data:
                {habitContext}
                """;

            // 4. Call Grok API
            var requestBody = new
            {
                model = GrokModel,
                messages = new[]
                {
                    new { role = "system", content = "You are a helpful and motivating habit coach. Always respond with valid JSON only." },
                    new { role = "user",   content = prompt }
                },
                temperature = 0.7,
                max_tokens  = 800
            };

            var json    = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _grokApiKey);

            HttpResponseMessage response = await _httpClient.PostAsync(GrokEndpoint, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Grok API error {response.StatusCode}: {error}");
            }

            // 5. Parse response
            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc2   = JsonDocument.Parse(responseJson);

            string rawContent = doc2.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "[]";

            // Strip any accidental markdown code fences
            rawContent = rawContent
                .Replace("```json", "")
                .Replace("```", "")
                .Trim();

            var suggestions = JsonSerializer.Deserialize<List<SuggestionItemDto>>(rawContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                ?? new List<SuggestionItemDto>();

            return new SuggestionResponseDto
            {
                UserId      = userId,
                Suggestions = suggestions,
                GeneratedAt = DateTime.UtcNow
            };
        }

        // ── Helper ──────────────────────────────────────────────────────────────

        private static string BuildHabitContext(List<Habit> habits)
        {
            if (habits.Count == 0)
                return "The user has no habits yet. Suggest good starter habits for beginners.";

            var sb = new StringBuilder();
            sb.AppendLine($"Total habits: {habits.Count}");
            sb.AppendLine();

            foreach (var h in habits)
            {
                sb.AppendLine($"- Title: {h.Title}");
                sb.AppendLine($"  Description: {h.Description}");
                sb.AppendLine($"  Frequency: {h.Frequency}");
                sb.AppendLine($"  Target count: {h.TargetCount}");
                sb.AppendLine($"  Current streak: {h.StreakCount} {(h.Frequency == "daily" ? "days" : "weeks")}");
                sb.AppendLine($"  Completed today: {h.IsCompleted}");
                sb.AppendLine($"  Last completed: {(h.LastCompletedAt.HasValue ? h.LastCompletedAt.Value.ToString("yyyy-MM-dd HH:mm") + " UTC" : "Never")}");
                sb.AppendLine($"  Started: {h.StartDate:yyyy-MM-dd}");
                sb.AppendLine();
            }

            // Time of day pattern — infer from LastCompletedAt hours
            var completedHours = habits
                .Where(h => h.LastCompletedAt.HasValue)
                .Select(h => h.LastCompletedAt!.Value.Hour)
                .ToList();

            if (completedHours.Count > 0)
            {
                double avgHour = completedHours.Average();
                string timeOfDay = avgHour < 12 ? "morning" : avgHour < 17 ? "afternoon" : "evening";
                sb.AppendLine($"Typical completion time: {timeOfDay} (avg hour {avgHour:F1} UTC)");
            }

            return sb.ToString();
        }
    }
}