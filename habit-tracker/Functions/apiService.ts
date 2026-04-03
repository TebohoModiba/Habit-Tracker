// ─── Base URL ─────────────────────────────────────────────────────────────────
// Change this to your deployed API URL for production
const BASE_URL = 'http://10.0.2.2:5000/api'; // Android emulator → localhost
// const BASE_URL = 'http://localhost:5000/api'; // iOS simulator

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    userId: string;
    username: string;
    firstName: string;
}

export interface HabitPayload {
    userId: string;
    title: string;
    description: string;
    frequency: 'daily' | 'weekly';
    targetCount: number;
    startDate: string; // ISO string
}

export interface Habit {
    habitId: string;
    userId: string;
    title: string;
    description: string;
    frequency: 'daily' | 'weekly';
    targetCount: number;
    streakCount: number;
    isCompleted: boolean;
    startDate: string;
    lastCompletedAt: string | null;
    createdAt: string;
}

export interface SuggestionItem {
    title: string;
    description: string;
    frequency: 'daily' | 'weekly';
    targetCount: number;
}

export interface SuggestionResponse {
    userId: string;
    suggestions: SuggestionItem[];
    generatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data as T;
}

function jsonHeaders() {
    return { 'Content-Type': 'application/json' };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function register(payload: RegisterPayload): Promise<{ message: string; userId: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

async function login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

// ─── Habits ───────────────────────────────────────────────────────────────────

async function createHabit(payload: HabitPayload): Promise<Habit> {
    const res = await fetch(`${BASE_URL}/habits`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

async function getHabitsByUser(userId: string): Promise<Habit[]> {
    const res = await fetch(`${BASE_URL}/habits/user/${userId}`, {
        method: 'GET',
        headers: jsonHeaders(),
    });
    return handleResponse(res);
}

async function getHabitById(habitId: string): Promise<Habit> {
    const res = await fetch(`${BASE_URL}/habits/${habitId}`, {
        method: 'GET',
        headers: jsonHeaders(),
    });
    return handleResponse(res);
}

async function updateHabit(habitId: string, payload: HabitPayload): Promise<Habit> {
    const res = await fetch(`${BASE_URL}/habits/${habitId}`, {
        method: 'PUT',
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

async function deleteHabit(habitId: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/habits/${habitId}`, {
        method: 'DELETE',
        headers: jsonHeaders(),
    });
    return handleResponse(res);
}

async function markHabitComplete(habitId: string): Promise<Habit> {
    const res = await fetch(`${BASE_URL}/habits/${habitId}/complete`, {
        method: 'PATCH',
        headers: jsonHeaders(),
    });
    return handleResponse(res);
}

// ─── Suggestions ──────────────────────────────────────────────────────────────

async function getSuggestions(userId: string): Promise<SuggestionResponse> {
    const res = await fetch(`${BASE_URL}/suggestions/${userId}`, {
        method: 'POST',
        headers: jsonHeaders(),
    });
    return handleResponse(res);
}

// ─── Export ───────────────────────────────────────────────────────────────────

const apiService = {
    register,
    login,
    createHabit,
    getHabitsByUser,
    getHabitById,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    getSuggestions,
};

export default apiService;