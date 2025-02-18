'use client';
import {signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useState } from "react";
import axios from "axios";
import { set, z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import {Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(4).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});
import { useRouter } from "next/navigation";


/*
TODO: maybe implement this https://stackoverflow.com/questions/77507221/is-there-a-way-to-get-form-values-with-onchange-using-shadcn-form-zod
instead of using the currect onSubmit method
*/

export default function SignIn() {
const router = useRouter();
const handleSignIn = async (username: string, email: string, password: string) => {
 try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("signed in, email: ", userCredential.user.email);
    router.push("/")
 } catch (err) {
   console.error("Failed to sign in", err);
 }
};

const onSubmit = async (data: z.infer<typeof formSchema>) => {
  await handleSignIn(data.username, data.email, data.password);
};


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  return (
    <div className="bg-[#1e1e2e] flex flex-col items-center justify-center h-screen"> 
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#cba6f7]">Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
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
                     <Input placeholder="email" {...field} />
                   </FormControl>
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
                     type="password"
                    placeholder="password" {...field} />
                   </FormControl>
                 </FormItem>
        )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    <p>Dont have an account? Create one</p>
    </div>
  );
}
