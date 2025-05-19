"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { handleResetFilters } from "@/app/utils/resetFilters";

interface NavbarProps {
  onAddItemClick: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  setPriceRange: React.Dispatch<React.SetStateAction<{ min: string; max: string }>>;
  setSelectedPriorities: React.Dispatch<React.SetStateAction<string[]>>;
}

const Navbar: React.FC<NavbarProps> = ({
  onAddItemClick,
  onSearchChange,
  setSelectedCategories,
  setSelectedStatuses,
  setPriceRange,
  setSelectedPriorities,
}) => {
  const [username, setUsername] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUsername = localStorage.getItem("loggedInUser");
    console.debug("[Navbar] Loaded username from localStorage:", storedUsername);
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    console.debug("[Navbar] Logging out, clearing loggedInUser");
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <nav className="p-5">
      <div className="max-w-8x2 mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <h1 className="text-3xl font-bold text-black">
          🎁 {username ? `${username}'s Wishlist` : "My Wishlist"}
        </h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              onChange={onSearchChange}
              className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Add Item */}
          <button
            type="button"
            title="Add new item"
            aria-label="Add new item"
            onClick={onAddItemClick}
            className="border border-gray-400 bg-white text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 hover:text-white transition duration-300 transform hover:scale-105"
          >
            <span className="block md:hidden text-xl font-bold">+</span>
            <span className="hidden md:inline">+ Add Item</span>
          </button>

          {/* Avatar with HoverCard and Logout */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                    className="border border-gray-400 rounded-full"
                    alt="User Avatar"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="bg-white text-black shadow-lg border border-gray-200 w-52 p-4">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-semibold">{username || "Guest"}</h2>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="mt-2 bg-red-600 text-white px-3 py-1.5 rounded-md font-medium shadow hover:bg-white hover:text-red-600 border border-red-600 transition-colors duration-300">
                      Logout
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader className="text-center">
                      <AlertDialogTitle className="text-black text-center text-lg font-semibold">
                        Are you sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-black text-center mt-2">
                        You will be logged out and redirected to the login page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center gap-4 mt-4">
                      <AlertDialogCancel className="bg-red-600 text-black px-4 py-2 rounded-md font-medium shadow-md border border-red-600 hover:bg-gray-500 hover:text-red-600 transition-colors duration-300">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleLogout();
                          handleResetFilters(
                            setSelectedCategories,
                            setSelectedStatuses,
                            setPriceRange,
                            setSelectedPriorities
                          );
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md font-medium shadow-md border border-red-600 hover:bg-white hover:text-red-600 transition-colors duration-300"
                      >
                        Confirm Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;