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
import { ClipboardList, House, Keyboard, LogOut, UserPen } from "lucide-react"

export default function NavBar() {
  const { user, loading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  let button

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
  } else {
    button = (
      <Link
        href="/sign-in"
        className="text-[#f9e2af] font-bold text-xl bg-transparent group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-[#b4befe] focus:outline-none disabled:pointer-events-none"
      >
        Sign In
      </Link>
    )
  }

  let my_svg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="130" height="40" viewBox="0 0 240 80">
  <circle cx="40" cy="40" r="30" fill="none" stroke="#cba6f7" strokeWidth="2"/>
  

  <rect x="20" y="32" width="40" height="8" rx="4" fill="#cba6f7"/>
  

  <circle cx="30" cy="40" r="3" fill="#45475a" stroke="#cba6f7" strokeWidth="3"/>
  <circle cx="50" cy="40" r="3" fill="#45475a" stroke="#cba6f7" strokeWidth="3"/>
  
  <text x="80" y="47" fontFamily="Helvetica, Arial, sans-serif" fontSize="28" fill="#cba6f7">banditType</text>
</svg>
  )

  return (
    <div className="w-screen bg-[#1e1e2e] flex items-center justify-between pl-[3rem] pr-[3rem] pt-2 border-b border-[#181825]">
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
            <Link href="/leaderboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <ClipboardList className="h-5"/>
                <p className="text-sm">Leaderboard</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/me" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <UserPen className="h-5" />
                <p className="text-sm">Profile</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div>{button}</div>
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
