using Microsoft.AspNetCore.Mvc;
using HabitTrackerApi.Services;

namespace HabitTrackerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuggestionsController : ControllerBase
    {
        private readonly SuggestionService _suggestionService;

        public SuggestionsController(SuggestionService suggestionService)
        {
            _suggestionService = suggestionService;
        }

        // POST: api/suggestions/{userId}
        // Fetches the user's habits from Firestore and asks Grok for personalised suggestions
        [HttpPost("{userId}")]
        public async Task<IActionResult> GetSuggestions(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest(new { message = "UserId is required." });

            try
            {
                var result = await _suggestionService.GetSuggestionsAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Failed to generate suggestions: {ex.Message}" });
            }
        }
    }
}