using System.Text.Json;
using Google.Cloud.Firestore;
using Google.GenAI;
using Google.GenAI.Types;
using HabitTrackerApi.Models.DTOs;

namespace HabitTrackerApi.Services;

public class SuggestionService
{
    private readonly FirestoreDb _firestore;
    private readonly Client _geminiClient;

    public SuggestionService(FirestoreDb firestore, IConfiguration config, HttpClient httpClient)
    {
        _firestore = firestore;
        var apiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini API key missing");
        _geminiClient = new Client(apiKey: apiKey);
    }

    public async Task<SuggestionResponseDto> GetSuggestionsAsync(string userId)
    {
        try
        {
            var habits = await GetUserHabits(userId);
            var prompt = BuildPrompt(habits);
            var suggestions = await CallGeminiApi(prompt);
            return new SuggestionResponseDto
            {
                UserId = userId,
                GeneratedAt = DateTime.UtcNow,
                Suggestions = suggestions
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Gemini API fallback: {ex.Message}");
            return GetMockSuggestions(userId);
        }
    }

    private async Task<List<HabitDto>> GetUserHabits(string userId)
    {
        var habitsRef = _firestore.Collection("habits");
        var query = habitsRef.WhereEqualTo("UserId", userId);
        var snapshot = await query.GetSnapshotAsync();

        var habits = new List<HabitDto>();
        foreach (var doc in snapshot.Documents)
        {
            var dict = doc.ToDictionary();
            var habit = new HabitDto
            {
                HabitId = doc.Id,
                UserId = dict.ContainsKey("UserId") ? dict["UserId"]?.ToString() ?? "" : "",
                Title = dict.ContainsKey("Title") ? dict["Title"]?.ToString() ?? "" : "",
                Description = dict.ContainsKey("Description") ? dict["Description"]?.ToString() ?? "" : "",
                Frequency = dict.ContainsKey("Frequency") ? dict["Frequency"]?.ToString() ?? "daily" : "daily",
                TargetCount = dict.ContainsKey("TargetCount") ? Convert.ToInt32(dict["TargetCount"]) : 1,
                StreakCount = dict.ContainsKey("StreakCount") ? Convert.ToInt32(dict["StreakCount"]) : 0,
                IsCompleted = dict.ContainsKey("IsCompleted") ? Convert.ToBoolean(dict["IsCompleted"]) : false,
                StartDate = dict.ContainsKey("StartDate") && dict["StartDate"] is Timestamp tsStart ? tsStart.ToDateTime() : DateTime.UtcNow,
                LastCompletedAt = dict.ContainsKey("LastCompletedAt") && dict["LastCompletedAt"] is Timestamp tsLast ? tsLast.ToDateTime() : (DateTime?)null,
                CreatedAt = dict.ContainsKey("CreatedAt") && dict["CreatedAt"] is Timestamp tsCreated ? tsCreated.ToDateTime() : DateTime.UtcNow
            };
            habits.Add(habit);
        }
        return habits;
    }

    private string BuildPrompt(List<HabitDto> habits)
    {
        string baseInstruction = "Return ONLY a valid JSON array. No extra text, no markdown. Each object must have fields: title (string, max 30 chars), description (string, max 30 chars), frequency (\"daily\" or \"weekly\"), targetCount (integer). Provide exactly 3 habits. Example: [{\"title\":\"Morning Stretch\",\"description\":\"10 min yoga\",\"frequency\":\"daily\",\"targetCount\":1}]";
        if (habits.Count == 0)
            return baseInstruction + " Suggest 3 healthy habits for a beginner.";
        var habitList = string.Join(", ", habits.Select(h => $"{h.Title} ({h.Frequency})"));
        return baseInstruction + $" User currently tracks: {habitList}. Suggest 3 new complementary habits.";
    }

    private async Task<List<SuggestionItemDto>> CallGeminiApi(string prompt)
    {
        var response = await _geminiClient.Models.GenerateContentAsync(
            model: "gemini-2.5-flash",
            contents: prompt,
            config: new GenerateContentConfig
            {
                Temperature = 0.7f,
                MaxOutputTokens = 1500
            }
        );

        if (response.Candidates == null || response.Candidates.Count == 0)
            throw new Exception("No candidates returned from Gemini");

        var rawText = response.Candidates[0].Content.Parts[0].Text;
        if (string.IsNullOrEmpty(rawText))
            throw new Exception("Empty response from Gemini API");

        var cleanedText = rawText.Trim();
        if (cleanedText.StartsWith("```json"))
            cleanedText = cleanedText.Substring(7);
        else if (cleanedText.StartsWith("```"))
            cleanedText = cleanedText.Substring(3);
        if (cleanedText.EndsWith("```"))
            cleanedText = cleanedText.Substring(0, cleanedText.Length - 3);
        cleanedText = cleanedText.Trim();

        int start = cleanedText.IndexOf('[');
        int end = cleanedText.LastIndexOf(']');
        if (start != -1 && end != -1 && end > start)
            cleanedText = cleanedText.Substring(start, end - start + 1);
        else
            throw new Exception("No JSON array found in response");

        Console.WriteLine("Cleaned JSON: " + cleanedText);

        try
        {
            var suggestions = JsonSerializer.Deserialize<List<SuggestionItemDto>>(cleanedText);
            foreach (var s in suggestions ?? new List<SuggestionItemDto>())
            {
                if (string.IsNullOrWhiteSpace(s.Title))
                    s.Title = "New Habit";
                if (string.IsNullOrWhiteSpace(s.Description))
                    s.Description = "Stay consistent";
                if (s.TargetCount <= 0)
                    s.TargetCount = 1;
                if (s.Frequency != "daily" && s.Frequency != "weekly")
                    s.Frequency = "daily";
            }
            return suggestions ?? new List<SuggestionItemDto>();
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"JSON parsing failed: {ex.Message}");
            Console.WriteLine("Problematic JSON: " + cleanedText);
            return new List<SuggestionItemDto>();
        }
    }

    private SuggestionResponseDto GetMockSuggestions(string userId)
    {
        return new SuggestionResponseDto
        {
            UserId = userId,
            GeneratedAt = DateTime.UtcNow,
            Suggestions = new List<SuggestionItemDto>
            {
                new SuggestionItemDto { Title = "Read 10 pages", Description = "Expand your knowledge daily.", Frequency = "daily", TargetCount = 1 },
                new SuggestionItemDto { Title = "Drink 8 glasses of water", Description = "Stay hydrated.", Frequency = "daily", TargetCount = 8 },
                new SuggestionItemDto { Title = "Weekly planning", Description = "Plan your week every Sunday.", Frequency = "weekly", TargetCount = 1 }
            }
        };
    }
}