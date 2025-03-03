import { LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="w-full border-b border-zinc-700 bg-zinc-800/90 backdrop-blur-sm">
      <div className="w-full flex h-16 px-10 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-primary">
            expenses
            <span className="text-white">.ai</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-zinc-300">
                <span>Hello, </span>
                <span className="font-medium text-white">
                  {user.name || user.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => signOut(auth)}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" color="white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user && (
                <>
                  <div className="px-2 py-1.5 text-sm text-zinc-300">
                    <span>Hello, </span>
                    <span className="font-medium text-white">
                      {user.name || user.email}
                    </span>
                  </div>
                  <DropdownMenuItem
                    onClick={() => signOut(auth)}
                    className="cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" color="#575757" />
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
