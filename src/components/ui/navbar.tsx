"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "./button"
import { useAuth } from "@/utils/authContext"
import { useEffect, useState } from "react"
import { auth} from "@/utils/firebase"


export default function NavBar() {
    const {user, loading} = useAuth()
    const [isMounted, setIsMounted] = useState(false); 
  useEffect(() => {
    setIsMounted(true);
  }, []);

    if (!isMounted) {
      return null;
    }

    let button

    let username = user?.displayName

    if (loading) {
        button = (
        <Link className={navigationMenuTriggerStyle()} href="/sign-up">
        <Button className="">
            Loading
        </Button>
        </Link>
        )
    }
    else if (user) {
      console.log(username)
        button = (

        <Link onClick={() => auth.signOut()} className="text-[#f9e2af] font-bold text-xl bg-transparent group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors  hover:text-[#b4befe]  focus:outline-none disabled:pointer-events-none" href={""}>
            Sign Out
        </Link>

        )
    } else {
        button = (
        <Link href="/sign-in" className="text-[#f9e2af] font-bold text-xl bg-transparent group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors  hover:text-[#b4befe]  focus:outline-none disabled:pointer-events-none">
            Sign In
        </Link>
        )
    }
  return (
    <div className="w-screen bg-[#1e1e2e] flex justify-center pt-2">
    <NavigationMenu >
      <NavigationMenuList className="flex space-x-4">
      <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link  href="/leaderboard" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Leaderboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/me" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              My Profile
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
        {button}
      </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-md font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
