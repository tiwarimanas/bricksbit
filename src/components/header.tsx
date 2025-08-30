"use client";

import Link from "next/link";
import { Target, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    const { success, error } = await signInWithGoogle();
    if (success) {
      toast({
        title: "Welcome!",
        description: "You've successfully signed in.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Sign-in failed",
        description: error?.message || "An unknown error occurred.",
      });
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
              Habitual Harmony
            </h1>
          </Link>
          <div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
                      <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Button onClick={handleSignIn} size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
