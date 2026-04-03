namespace HabitTrackerApi.Models.DTOs
{
    public class SuggestionItemDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Frequency { get; set; } = "daily";
        public int TargetCount { get; set; } = 1;
    }

    public class SuggestionResponseDto
    {
        public string UserId { get; set; } = string.Empty;
        public List<SuggestionItemDto> Suggestions { get; set; } = new();
        public DateTime GeneratedAt { get; set; }
    }
}