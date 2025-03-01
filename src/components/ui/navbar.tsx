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
import { auth } from "@/utils/firebase"
import { ClipboardList, Github, House, Keyboard, LogIn, LogOut, Swords, UserPen } from "lucide-react"
import axios from "axios"

const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

export default function NavBar() {
  const getUsername = async(uid: string) => {
    try {
        const resp = await axios.get(`${apiBaseURL}/users/${uid}/username`)
        let username = JSON.stringify(resp.data).slice(1, -1);
        return username
    } catch (error) {
        console.log("Failed to get username", error);
    }
}
  const { user, loading } = useAuth()
  const [username, setUsername] = useState("")

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const name = await getUsername(user.uid);
        if (name) {
          setUsername(name);
          console.log("User: ", username)
        }
      }
    };
    fetchUsername();
  }, [user]);

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  let button
  let profile


  if (loading) {
    button = (
      <Link className={navigationMenuTriggerStyle()} href="/sign-up">
        <Button className="">Loading</Button>
      </Link>
    )
  } else if (user) {
    button = (
      <Link
        onClick={() => auth.signOut()}
        href={""}
        className="text-[#f9e2af] font-bold text-xl bg-transparent group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-[#b4befe] focus:outline-none disabled:pointer-events-none"
      >
        <LogOut />
        <p className="text-sm">Sign Out</p>
      </Link>
    )

    profile = (
      <NavigationMenuItem>
      <Link href="/profile/[username]" as={`/profile/${username}`} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          <UserPen className="h-5" />
          <p className="text-sm">Profile</p>
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
    )
  } else {
    button = (
      <Link
        href="/sign-in"
        className="text-[#f9e2af] font-bold text-xl bg-transparent group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-[#b4befe] focus:outline-none disabled:pointer-events-none"
      >
        <LogIn className="mr-2"/>
        Sign In
      </Link>
    )
    profile =(
      <></>
    )
  }

  let my_svg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="130" height="40" viewBox="0 0 200 80">
  <circle cx="40" cy="40" r="30" fill="none" stroke="#cba6f7" strokeWidth="2"/>
  

  <rect x="20" y="32" width="40" height="8" rx="4" fill="#cba6f7"/>
  

  <circle cx="30" cy="40" r="3" fill="#45475a" stroke="#cba6f7" strokeWidth="3"/>
  <circle cx="50" cy="40" r="3" fill="#45475a" stroke="#cba6f7" strokeWidth="3"/>
  
  <text x="80" y="47" fontSize="28" fill="#cba6f7">banditType</text>
</svg>
  )
  return (
    <div className="w-screen bg-[#1e1e2e] flex items-center justify-between pl-[1rem] pr-[3rem] pt-2 border-b border-[#181825]">
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-1">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <a>
                {my_svg}
              </a>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link  className="text-[#cba6f7]" href={"https://github.com/diegolara93/BanditType"}>
            <Github className="h-5" ></Github>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/leaderboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <ClipboardList className="h-5"/>
                <p className="text-sm">Leaderboard</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/duels" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Swords className="h-5"/>
                <p className="text-sm">Duels</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {profile}
        </NavigationMenuList>
      </NavigationMenu>
      <div>
        {button}</div>
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
