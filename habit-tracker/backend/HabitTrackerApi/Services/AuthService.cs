using Google.Cloud.Firestore;
using HabitTrackerApi.Models;
using HabitTrackerApi.Models.DTOs;
using BCrypt.Net;

namespace HabitTrackerApi.Services
{
    public class AuthService
    {
        private readonly FirestoreDb _db;

        public AuthService(FirestoreDb db)
        {
            _db = db;
        }

        public async Task<AuthResult> RegisterAsync(RegisterDto dto)
        {
            try
            {
                // Check if email already exists
                Query emailQuery = _db.Collection("users").WhereEqualTo("Email", dto.Email);
                QuerySnapshot emailSnapshot = await emailQuery.GetSnapshotAsync();

                if (emailSnapshot.Count > 0)
                {
                    return new AuthResult { Success = false, Message = "Email is already registered." };
                }

                // Check if username already exists
                Query usernameQuery = _db.Collection("users").WhereEqualTo("Username", dto.Username);
                QuerySnapshot usernameSnapshot = await usernameQuery.GetSnapshotAsync();

                if (usernameSnapshot.Count > 0)
                {
                    return new AuthResult { Success = false, Message = "Username is already taken." };
                }

                // Hash the password
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

                // Create new user
                var newUser = new User
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Username = dto.Username,
                    Email = dto.Email,
                    PasswordHash = passwordHash,
                    CreatedAt = DateTime.UtcNow
                };

                // Save to Firestore
                DocumentReference docRef = await _db.Collection("users").AddAsync(newUser);

                return new AuthResult
                {
                    Success = true,
                    Message = "Account created successfully.",
                    UserId = docRef.Id,
                    Username = dto.Username,
                    FirstName = dto.FirstName
                };
            }
            catch (Exception ex)
            {
                return new AuthResult { Success = false, Message = $"Registration failed: {ex.Message}" };
            }
        }

        public async Task<AuthResult> LoginAsync(LoginDto dto)
        {
            try
            {
                // Find user by email
                Query query = _db.Collection("users").WhereEqualTo("Email", dto.Email);
                QuerySnapshot snapshot = await query.GetSnapshotAsync();

                if (snapshot.Count == 0)
                {
                    return new AuthResult { Success = false, Message = "Invalid email or password." };
                }

                // Get user document
                DocumentSnapshot userDoc = snapshot.Documents[0];
                User user = userDoc.ConvertTo<User>();
                user.UserId = userDoc.Id;

                // Verify password
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

                if (!isPasswordValid)
                {
                    return new AuthResult { Success = false, Message = "Invalid email or password." };
                }

                return new AuthResult
                {
                    Success = true,
                    Message = "Login successful.",
                    UserId = user.UserId,
                    Username = user.Username,
                    FirstName = user.FirstName
                };
            }
            catch (Exception ex)
            {
                return new AuthResult { Success = false, Message = $"Login failed: {ex.Message}" };
            }
        }
    }
}