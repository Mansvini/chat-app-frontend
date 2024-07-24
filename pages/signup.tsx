"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import Link from "next/link"
import { useToast } from '../components/ui/use-toast';
import Loader from '../components/ui/Loader';
import withAuth from '@/components/withAuth';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
  
    const handleSignup = async () => {
        setLoading(true);
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, firstName, lastName }),
        });
        
        setLoading(false);
        
        if (res.ok) {
            toast({
                description: "User created successfully!",
            })
            router.push('/login');
        } else {
            const errorData = await res.json();
            console.log(errorData)
            toast({
                variant: "destructive",
                description: errorData.message || "'Something went wrong!",
            })
        }
    };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input 
                        id="first-name" 
                        placeholder="Max" 
                        required 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input 
                        id="last-name" 
                        placeholder="Robinson" 
                        required 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                    />
                </div>
            </div>
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
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            <Button type="submit" className="w-full" onClick={handleSignup} disabled={loading}>
                {loading ? <Loader /> :'Create an account'}
            </Button>
        </div>
        <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
                Sign in
            </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default withAuth(Signup, false);