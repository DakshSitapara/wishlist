// app/login/loginUtils.ts

export function login(email: string): boolean {
  const users = JSON.parse(localStorage.getItem('users') || '{}');

  if (users[email]) {
    localStorage.setItem('loggedInUser', email); // save active session
    return true;
  }

  alert('User not found. Please sign up.');
  return false;
}
