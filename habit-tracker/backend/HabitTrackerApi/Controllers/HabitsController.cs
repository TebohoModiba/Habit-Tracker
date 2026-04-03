using Microsoft.AspNetCore.Mvc;
using HabitTrackerApi.Models.DTOs;
using HabitTrackerApi.Services;

namespace HabitTrackerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitsController : ControllerBase
    {
        private readonly HabitService _habitService;

        public HabitsController(HabitService habitService)
        {
            _habitService = habitService;
        }

        // POST: api/habits
        [HttpPost]
        public async Task<IActionResult> CreateHabit([FromBody] HabitDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UserId) || string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "UserId and Title are required." });

            if (dto.Frequency != "daily" && dto.Frequency != "weekly")
                return BadRequest(new { message = "Frequency must be 'daily' or 'weekly'." });

            if (dto.TargetCount < 1)
                return BadRequest(new { message = "TargetCount must be at least 1." });

            var result = await _habitService.CreateHabitAsync(dto);

            if (result == null)
                return StatusCode(500, new { message = "Failed to create habit." });

            return CreatedAtAction(nameof(GetHabitById), new { habitId = result.HabitId }, result);
        }

        // GET: api/habits/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetHabitsByUser(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest(new { message = "UserId is required." });

            var habits = await _habitService.GetHabitsByUserAsync(userId);
            return Ok(habits);
        }

        // GET: api/habits/{habitId}
        [HttpGet("{habitId}")]
        public async Task<IActionResult> GetHabitById(string habitId)
        {
            var habit = await _habitService.GetHabitByIdAsync(habitId);

            if (habit == null)
                return NotFound(new { message = "Habit not found." });

            return Ok(habit);
        }

        // PUT: api/habits/{habitId}
        [HttpPut("{habitId}")]
        public async Task<IActionResult> UpdateHabit(string habitId, [FromBody] HabitDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Title is required." });

            if (dto.Frequency != "daily" && dto.Frequency != "weekly")
                return BadRequest(new { message = "Frequency must be 'daily' or 'weekly'." });

            var result = await _habitService.UpdateHabitAsync(habitId, dto);

            if (result == null)
                return NotFound(new { message = "Habit not found." });

            return Ok(result);
        }

        // DELETE: api/habits/{habitId}
        [HttpDelete("{habitId}")]
        public async Task<IActionResult> DeleteHabit(string habitId)
        {
            var success = await _habitService.DeleteHabitAsync(habitId);

            if (!success)
                return NotFound(new { message = "Habit not found." });

            return Ok(new { message = "Habit deleted successfully." });
        }

        // PATCH: api/habits/{habitId}/complete
        [HttpPatch("{habitId}/complete")]
        public async Task<IActionResult> MarkComplete(string habitId)
        {
            var result = await _habitService.MarkCompleteAsync(habitId);

            if (result == null)
                return NotFound(new { message = "Habit not found." });

            return Ok(result);
        }
    }
}