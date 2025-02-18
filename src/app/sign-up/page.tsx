'use client';
import {createUserWithEmailAndPassword} from "firebase/auth";
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


/*
TODO: maybe implement this https://stackoverflow.com/questions/77507221/is-there-a-way-to-get-form-values-with-onchange-using-shadcn-form-zod
instead of using the currect onSubmit method
*/

export default function SignUp() {
const handleSignUp = async (username: string, email: string, password: string) => {
  try {
    await axios.get(`http://127.0.0.1:8000/users/${username}`);
    console.error("Username is already taken.");
    return;
  } catch (err) {
    if (axios.isAxiosError(err) && (!err.response || err.response.status !== 404)) {
      console.error("Failed to check username", err);
      return;
    }
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await axios.post("http://127.0.0.1:8000/users/", {
    username,
    email: user.email,
    uid: user.uid,
    bio: "Empty Bio",
  });
  console.log("User created successfully");
};

const onSubmit = async (data: z.infer<typeof formSchema>) => {
  await handleSignUp(data.username, data.email, data.password);
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
    <div className="bg-[grey] flex flex-col items-center justify-center h-screen"> 
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
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
                   <FormLabel>Email</FormLabel>
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
                   <FormLabel>Password</FormLabel>
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
    </div>
  );
}
