import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Base URL ─────────────────────────────────────────────────────────────────
const BASE_URL = 'http://192.168.1.89:5000/api'; // Physical device → PC WiFi IP
// const BASE_URL = 'http://10.0.2.2:5000/api'; // Android emulator
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
    token: string;          // ✅ Added token field (your backend must return it)
}

export interface HabitPayload {
    userId: string;
    title: string;
    description: string;
    frequency: 'daily' | 'weekly';
    targetCount: number;
    startDate: string;
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

// Get stored token for authenticated requests
async function getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function register(payload: RegisterPayload): Promise<{ message: string; userId: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

async function login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await handleResponse<AuthResponse>(res);

    // ✅ Store token and user data after successful login
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        email: payload.email,
        username: data.username,
        firstName: data.firstName,
    }));

    return data;
}

async function logout(): Promise<void> {
    await AsyncStorage.multiRemove(['token', 'user']);
}

// ─── Habits ───────────────────────────────────────────────────────────────────

async function createHabit(payload: HabitPayload): Promise<Habit> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/habits`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

async function getHabitsByUser(userId: string): Promise<Habit[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/habits/user/${userId}`, {
        method: 'GET',
        headers,
    });
    return handleResponse(res);
}

async function getHabitById(habitId: string): Promise<Habit> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/habits/${habitId}`, {
        method: 'GET',
        headers,
    });
    return handleResponse(res);
}

async function updateHabit(habitId: string, payload: HabitPayload): Promise<Habit> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/habits/${habitId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

async function deleteHabit(habitId: string): Promise<{ message: string }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/habits/${habitId}`, {
        method: 'DELETE',
        headers,
    });
    return handleResponse(res);
}

async function markHabitComplete(habitId: string): Promise<Habit> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/habits/${habitId}/complete`, {
        method: 'PATCH',
        headers,
    });
    return handleResponse(res);
}

// ─── Suggestions ──────────────────────────────────────────────────────────────

async function getSuggestions(userId: string): Promise<SuggestionResponse> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/suggestions/${userId}`, {
        method: 'POST',
        headers,
    });
    return handleResponse(res);
}

// ─── Export ───────────────────────────────────────────────────────────────────

const apiService = {
    register,
    login,
    logout,
    createHabit,
    getHabitsByUser,
    getHabitById,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    getSuggestions,
};

export default apiService;