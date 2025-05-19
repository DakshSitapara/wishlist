'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useLocalStorageState } from '../utils/useLocalStorageState';
import { Eye, EyeOff } from 'lucide-react';

// Define the User type for clarity
interface User {
  username: string;
  password: string;
}

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Specify the type for users as User[]
  const [users, setUsers] = useLocalStorageState<User[]>('users', []);
  const router = useRouter();

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form reload

    // Trim inputs to avoid issues with extra spaces
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Check if username already exists
    const userExists = users.some(
      (u: User) => u.username === trimmedUsername
    );

    if (userExists) {
      alert('Username already exists, please choose another');
      return;
    }

    // Create new user
    const newUser: User = { username: trimmedUsername, password: trimmedPassword };
    setUsers([...users, newUser]);

    // Initialize empty wishlist for the new user
    localStorage.setItem(`wishlist_${trimmedUsername}`, JSON.stringify([]));

    // Log in the new user
    localStorage.setItem('loggedInUser', trimmedUsername);
    router.push('/wishlist');
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center px-4 bg-[url('https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80')] bg-cover bg-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground">Create your account</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password} // Fixed typo (removed "juventus123")
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)} // Fixed onChange to onClick
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link href="/login" className="w-full mt-4">
              <Button className="w-full mt-4">Login</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}