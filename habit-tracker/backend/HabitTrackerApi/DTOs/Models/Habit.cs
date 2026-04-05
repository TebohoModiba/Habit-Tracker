using Google.Cloud.Firestore;

namespace HabitTrackerApi.Models
{
    [FirestoreData]
    public class Habit
    {
        [FirestoreDocumentId]
        public string? HabitId { get; set; }

        [FirestoreProperty]
        public string UserId { get; set; } = string.Empty;

        [FirestoreProperty]
        public string Title { get; set; } = string.Empty;

        [FirestoreProperty]
        public string Description { get; set; } = string.Empty;

        // "daily" or "weekly"
        [FirestoreProperty]
        public string Frequency { get; set; } = "daily";

        [FirestoreProperty]
        public int TargetCount { get; set; } = 1;

        [FirestoreProperty]
        public int StreakCount { get; set; } = 0;

        [FirestoreProperty]
        public bool IsCompleted { get; set; } = false;

        // Stored as UTC timestamp in Firestore
        [FirestoreProperty]
        public DateTime StartDate { get; set; } = DateTime.UtcNow;

        [FirestoreProperty]
        public DateTime? LastCompletedAt { get; set; }

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}