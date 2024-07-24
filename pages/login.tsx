"use client"
import { useState } from 'react';
import Link from "next/link"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useToast } from '../components/ui/use-toast';
import Loader from '../components/ui/Loader';
import { useAuth } from '../context/AuthContext';
import withAuth from '@/components/withAuth';

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
  
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    setLoading(false);

    if (res.ok) {
        const data = await res.json();
        login(data.token);
        toast({
            description: "Login successful!",
        })
    } else {
        const errorData = await res.json();
        toast({
            variant: "destructive",
            description: errorData.message || "Invalid credentials!",
        })
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              required
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                />
          </div>
          <Button type="submit" className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? <Loader/> : 'Login'}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default withAuth(Login, false);
