'use client';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters").max(50),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(50),
});

export default function SignUp() {
  const [globalError, setGlobalError] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  
  const handleSignUp = async (username: string, email: string, password: string) => {

    setGlobalError("");
    

    try {
      await axios.get(`http://127.0.0.1:8000/users/${username}`);
      form.setError("username", { message: "Username is already taken." });
      return;
    } catch (err) {
      if (axios.isAxiosError(err) && (!err.response || err.response.status !== 404)) {
        setGlobalError("Failed to check username. Please try again.");
        return;
      }
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await axios.post("http://127.0.0.1:8000/users/", {
        username,
        email: user.email,
        uid: user.uid,
        bio: "Empty Bio",
      });
      console.log("User created successfully");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        form.setError("email", { message: "Email is already in use." });
      } else {
        setGlobalError("An error occurred during sign up. Please try again.");
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await handleSignUp(data.username, data.email, data.password);
  };

  return (
    <div className="bg-[#1e1e2e] flex flex-col items-center justify-center h-[50rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#cba6f7]">Username</FormLabel>
                <FormControl>
                  <Input className="text-[#cdd6f4]" placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#cba6f7]">Email</FormLabel>
                <FormControl>
                  <Input className="text-[#cdd6f4]" placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#cba6f7]">Password</FormLabel>
                <FormControl>
                  <Input
                    className="text-[#cdd6f4]"
                    type="password"
                    placeholder="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button className="ml-14 text-[#1e1e2e] bg-[#89dceb]" type="submit">Sign Up</Button>
        </form>
      </Form>
      
      {globalError && (
        <p className="mt-3 text-red-500">{globalError}</p>
      )}
      
      <p className="mt-3 text-[#cba6f7]">
        Have an account?{" "}
        <Link className="underline" href="/sign-up">
          Sign in
        </Link>
      </p>
    </div>
  );
}
