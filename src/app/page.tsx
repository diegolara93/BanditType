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
import Link from "next/link";



/*
TODO: maybe implement this https://stackoverflow.com/questions/77507221/is-there-a-way-to-get-form-values-with-onchange-using-shadcn-form-zod
instead of using the currect onSubmit method
*/

export default function Home() {

  return (
<div>
<Link href="/sign-up">
  <Button>
    Sign Up
  </Button>
  </Link>
</div>
  )
}
