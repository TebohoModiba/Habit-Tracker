using Google.Cloud.Firestore;

namespace HabitTrackerApi.Data
{
    public class AppDbContext
    {
        private readonly FirestoreDb _db;

        public AppDbContext(FirestoreDb db)
        {
            _db = db;
        }

        public CollectionReference Users => _db.Collection("users");
        public CollectionReference Habits => _db.Collection("habits");
    }
}