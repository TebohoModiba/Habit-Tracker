import React from 'react';

function passwordValidation(password: string): { valid: boolean; message: string } {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  if (!regex.test(password)) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long and include uppercase, lowercase, and a number.'
    };
  }

  return { valid: true, message: '' };
}

function emailValidation(email: string): { valid: boolean; message: string } {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) {
    return {
      valid: false,
      message: 'Invalid email format. Please enter a valid email address.'
    };
  }

  return { valid: true, message: '' };
}

function fieldValidation(fields: { [key: string]: string }): { valid: boolean; message: string } {
  for (const [field, value] of Object.entries(fields)) {
    if (!value.trim()) {
      return {
        valid: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
      };
    }
  }
  return { valid: true, message: '' };
}

const habitService = {
  passwordValidation,
  emailValidation,
  fieldValidation,
};

export default habitService;