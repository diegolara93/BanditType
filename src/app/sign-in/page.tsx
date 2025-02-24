'use client';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(50),
});

export default function SignIn() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (email: string, password: string) => {
    setGlobalError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in, email: ", userCredential.user.email);
      router.push("/");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        form.setError("email", { message: "No account found with this email." });
      } else if (err.code === "auth/wrong-password") {
        form.setError("password", { message: "Incorrect password." });
      } else {
        setGlobalError("Failed to sign in. Please try again.");
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await handleSignIn(data.email, data.password);
  };

  return (
    <div className="bg-[#1e1e2e] flex flex-col items-center justify-center h-[50rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                  <Input className="text-[#cdd6f4]" type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="ml-14 text-[#1e1e2e] bg-[#89dceb]" type="submit">
            Sign In
          </Button>
        </form>
      </Form>
      {globalError && <p className="mt-3 text-red-500">{globalError}</p>}
      <p className="mt-3 text-[#cba6f7]">
        Don't have an account? <Link className="underline" href="/sign-up">Create one</Link>
      </p>
    </div>
  );
}
