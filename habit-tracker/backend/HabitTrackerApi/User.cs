using Google.Cloud.Firestore;


namespace HabitTrackerApi.Models
{
    [FirestoreData]
        public class User
        {
            [FirestoreDocumentId]
            public string? UserId { get; set; }

            [FirestoreProperty]
            public string FirstName { get; set; } = string.Empty;

            [FirestoreProperty]
        public string LastName { get; set; } = string.Empty;

        [FirestoreProperty]
        public string Username { get; set; } = string.Empty;

        [FirestoreProperty]
        public string Email { get; set; } = string.Empty;

        [FirestoreProperty]
        public string PasswordHash { get; set; } = string.Empty;

            [FirestoreProperty]
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        }
        }