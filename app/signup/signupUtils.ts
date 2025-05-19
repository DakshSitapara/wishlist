// app/signup/signupUtils.ts

export function signup(name: string, email: string): boolean {
  const users = JSON.parse(localStorage.getItem('users') || '{}');

  if (users[email]) {
    alert('User already exists!');
    return false;
  }

  // Create new user with empty wishlist
  users[email] = {
    name,
    email,
    wishlist: [], // initialize empty wishlist
  };

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('loggedInUser', email); // store current session

  return true;
}
