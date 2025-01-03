"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface SignupResponse {
  success: boolean;
  message: string;
  _id?: string;
}

interface ErrorResponse {
  success: boolean;
  message: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/signup", user);
      
      
      toast({
        title: "Sign-up successful",
        description: "Please verify your email address to complete the registration.",
      })

      router.push(`/verify/${response.data._id}`);
    } catch (error: any) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.success === false) {
        toast({
          title: "Sign-up failed",
          description: axiosError.response?.data?.message,
        });
      } else {
        toast({
          title: "Sign-up failed",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="p-8 rounded shadow-md w-full max-w-md border">
        <CardHeader>
          <div className="flex justify-center mb-6 font-bold text-2xl">
            Real time chess game
          </div>
          <CardTitle>
            {loading ? "Processing" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            Please enter your details to sign up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSignup();
            }}
            className="flex flex-col space-y-4"
          >
            <Input
              type="text"
              placeholder="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
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
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 justify-center mt-4">
          <Button onClick={() => router.push("/login")}>
            Already have an account? Log in
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