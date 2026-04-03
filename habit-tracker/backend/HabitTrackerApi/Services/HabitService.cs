using Google.Cloud.Firestore;
using HabitTrackerApi.Models;
using HabitTrackerApi.Models.DTOs;

namespace HabitTrackerApi.Services
{
    public class HabitService
    {
        private readonly FirestoreDb _db;
        private const string Collection = "habits";

        public HabitService(FirestoreDb db)
        {
            _db = db;
        }

        // ── CREATE ──────────────────────────────────────────────────────────────

        public async Task<HabitResponseDto?> CreateHabitAsync(HabitDto dto)
        {
            var habit = new Habit
            {
                UserId      = dto.UserId,
                Title       = dto.Title,
                Description = dto.Description,
                Frequency   = dto.Frequency.ToLower(),
                TargetCount = dto.TargetCount,
                StartDate   = dto.StartDate,
                CreatedAt   = DateTime.UtcNow
            };

            DocumentReference docRef = await _db.Collection(Collection).AddAsync(habit);
            habit.HabitId = docRef.Id;

            return MapToResponse(habit);
        }

        // ── READ ────────────────────────────────────────────────────────────────

        public async Task<List<HabitResponseDto>> GetHabitsByUserAsync(string userId)
        {
            Query query = _db.Collection(Collection).WhereEqualTo("UserId", userId);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();

            var habits = new List<HabitResponseDto>();

            foreach (DocumentSnapshot doc in snapshot.Documents)
            {
                var habit = doc.ConvertTo<Habit>();
                habit.HabitId = doc.Id;
                habits.Add(MapToResponse(habit));
            }

            return habits;
        }

        public async Task<HabitResponseDto?> GetHabitByIdAsync(string habitId)
        {
            DocumentReference docRef = _db.Collection(Collection).Document(habitId);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists) return null;

            var habit = snapshot.ConvertTo<Habit>();
            habit.HabitId = snapshot.Id;

            return MapToResponse(habit);
        }

        // ── UPDATE ──────────────────────────────────────────────────────────────

        public async Task<HabitResponseDto?> UpdateHabitAsync(string habitId, HabitDto dto)
        {
            DocumentReference docRef = _db.Collection(Collection).Document(habitId);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists) return null;

            var updates = new Dictionary<string, object>
            {
                { "Title",       dto.Title },
                { "Description", dto.Description },
                { "Frequency",   dto.Frequency.ToLower() },
                { "TargetCount", dto.TargetCount },
                { "StartDate",   dto.StartDate }
            };

            await docRef.UpdateAsync(updates);

            // Return updated document
            var updated = snapshot.ConvertTo<Habit>();
            updated.HabitId     = snapshot.Id;
            updated.Title       = dto.Title;
            updated.Description = dto.Description;
            updated.Frequency   = dto.Frequency.ToLower();
            updated.TargetCount = dto.TargetCount;
            updated.StartDate   = dto.StartDate;

            return MapToResponse(updated);
        }

        // ── DELETE ──────────────────────────────────────────────────────────────

        public async Task<bool> DeleteHabitAsync(string habitId)
        {
            DocumentReference docRef = _db.Collection(Collection).Document(habitId);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists) return false;

            await docRef.DeleteAsync();
            return true;
        }

        // ── COMPLETE (streak logic) ─────────────────────────────────────────────

        public async Task<HabitResponseDto?> MarkCompleteAsync(string habitId)
        {
            DocumentReference docRef = _db.Collection(Collection).Document(habitId);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists) return null;

            var habit = snapshot.ConvertTo<Habit>();
            habit.HabitId = snapshot.Id;

            var now = DateTime.UtcNow;

            // Streak logic: only increment if not already completed today (daily)
            // or this week (weekly)
            bool shouldIncrementStreak = false;

            if (habit.LastCompletedAt == null)
            {
                shouldIncrementStreak = true;
            }
            else
            {
                var last = habit.LastCompletedAt.Value;

                if (habit.Frequency == "daily")
                {
                    // Check if last completion was yesterday — streak continues
                    // If same day — already done, no increment
                    // If older — streak resets
                    var daysDiff = (now.Date - last.Date).Days;
                    if (daysDiff == 1) shouldIncrementStreak = true;
                    else if (daysDiff > 1) { habit.StreakCount = 0; shouldIncrementStreak = true; }
                    // daysDiff == 0 means already completed today, no change
                }
                else if (habit.Frequency == "weekly")
                {
                    var weeksDiff = (int)((now.Date - last.Date).TotalDays / 7);
                    if (weeksDiff == 1) shouldIncrementStreak = true;
                    else if (weeksDiff > 1) { habit.StreakCount = 0; shouldIncrementStreak = true; }
                }
            }

            if (shouldIncrementStreak) habit.StreakCount++;

            habit.IsCompleted     = true;
            habit.LastCompletedAt = now;

            var updates = new Dictionary<string, object>
            {
                { "IsCompleted",     true },
                { "StreakCount",     habit.StreakCount },
                { "LastCompletedAt", now }
            };

            await docRef.UpdateAsync(updates);
            return MapToResponse(habit);
        }

        // ── MAPPER ──────────────────────────────────────────────────────────────

        private static HabitResponseDto MapToResponse(Habit habit) => new()
        {
            HabitId         = habit.HabitId ?? string.Empty,
            UserId          = habit.UserId,
            Title           = habit.Title,
            Description     = habit.Description,
            Frequency       = habit.Frequency,
            TargetCount     = habit.TargetCount,
            StreakCount     = habit.StreakCount,
            IsCompleted     = habit.IsCompleted,
            StartDate       = habit.StartDate,
            LastCompletedAt = habit.LastCompletedAt,
            CreatedAt       = habit.CreatedAt
        };
    }
}