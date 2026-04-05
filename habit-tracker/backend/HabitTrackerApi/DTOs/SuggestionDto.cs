using System.Text.Json.Serialization;

namespace HabitTrackerApi.Models.DTOs
{
    public class SuggestionItemDto
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("frequency")]
        public string Frequency { get; set; } = "daily";

        [JsonPropertyName("targetCount")]
        public int TargetCount { get; set; } = 1;
    }

    public class SuggestionResponseDto
    {
        [JsonPropertyName("userId")]
        public string UserId { get; set; } = string.Empty;

        [JsonPropertyName("suggestions")]
        public List<SuggestionItemDto> Suggestions { get; set; } = new();

        [JsonPropertyName("generatedAt")]
        public DateTime GeneratedAt { get; set; }
    }
}