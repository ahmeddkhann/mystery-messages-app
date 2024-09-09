"use client";

import { verifySchema } from "@/app/schemas/verifySchema";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {SubmitHandler } from 'react-hook-form'

const verifyAccount = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const register = useForm({
    resolver: zodResolver(verifySchema),
  });
type VerifySchemaType = z.infer<typeof verifySchema>;
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const respone = axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.log("error in signup of a user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast({
        title: "verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  return (
    <div
      className="flex justify-center items-center 
    min-h-screen bg-gray-100"
    >
      <div
        className="w-full max-w-md p-8 space-y-8 
      bg-white rounded-lg shadow-md"
      >
        <div className="text-center">
          <h1
            className="text-4xl font-extrabold 
           tracking-tight lg:text-5xl mb-6"
          >
            Verify your account
          </h1>
          <Form {...register}>
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={register.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="verification Code..." {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default verifyAccount;
