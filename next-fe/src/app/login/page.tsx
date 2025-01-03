"use client";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";  
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const onLogin = async () => {
    try {
      setLoading(true);
      
      const response = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.password,
      });

      

      if (response?.error) {
        toast({
          title: response.error,
        })
      } else {
        toast({
          title: "Login successful",
        })
       
        
        router.push("/"); // Use router.push instead of router.replace
      }
    } catch (error: any) {

      toast({
        title: error.message,
        })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return  (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="p-8 rounded shadow-md w-full max-w-md border">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </div>
          <CardTitle >
            {loading ? "Processing" : "Login"}
          </CardTitle>
          <CardDescription >
            Please enter your credentials to login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
            className="flex flex-col space-y-4"
          >
            <Input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              
            />
            <Input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              
            />
            <Button
              type="submit"
              disabled={buttonDisabled}
            >
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 justify-center mt-4">
          <Button
            
            onClick={() => router.push("/signup")}
          >
            Not a member? Sign up
          </Button>

          <Button>
            <Link href="/forgotPassword">
            Forgot password
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}