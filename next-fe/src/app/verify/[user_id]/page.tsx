"use client";

import React from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface FormData {
  pin: string;
}

export default function VerifyPage() {
  const { user_id } = useParams<{ user_id: string }>();
  const router = useRouter();
  const form = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post('/api/verifyEmail', {
        _id: user_id,
        code: data.pin,
      });

      toast({
        title: "Verification successful!",
        description: "You have successfully verified your email.",
      });
      router.replace('/login');
    } catch (error: any) {
      toast({
        title: "Verification failed!",
        description: error.response?.data?.message || "An error occurred while verifying.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-2xl mb-6 text-center">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your Email.
                    </FormDescription>
                    {form.formState.errors.pin && <FormMessage>{form.formState.errors.pin.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Verify
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}