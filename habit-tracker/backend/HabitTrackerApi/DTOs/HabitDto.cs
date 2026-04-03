namespace HabitTrackerApi.Models.DTOs
{
    // Used for creating or updating a habit
    public class HabitDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // "daily" or "weekly"
        public string Frequency { get; set; } = "daily";
        public int TargetCount { get; set; } = 1;
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }

    // Returned to the client — includes read-only fields
    public class HabitResponseDto
    {
        public string HabitId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public int TargetCount { get; set; }
        public int StreakCount { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? LastCompletedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}