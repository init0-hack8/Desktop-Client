import React, { useState, useEffect } from 'react';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/configs/firebase";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Link href="#" className="mr-6 hidden lg:flex">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">i0</span>
        </Link>
        <div className="grid gap-2 py-6">
          <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold">
            Home
          </Link>
          <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold">
            About
          </Link>
          <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold">
            Services
          </Link>
          <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold">
            Contact
          </Link>
        </div>
      </SheetContent>
    </Sheet>
    <Link href="#" className="mr-6 hidden lg:flex" >
      <MountainIcon className="h-6 w-6" />
      <span className="sr-only">I0</span>
    </Link>
    <nav className="ml-auto hidden lg:flex gap-6">
      <Button
        onClick={() => navigate('/dashboard')}
        className="text-[#000000] dark:text-[#ffffff] group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
      >
        Home
      </Button>
      <Button
        onClick={() => navigate('/history')}
        className="text-[#000000] dark:text-[#ffffff] group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
      >
        History
      </Button>
      <Button
        onClick={() => navigate('/graph')}
        className="text-[#000000] dark:text-[#ffffff] group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
      >
        Analysis
      </Button>
      <UserProfileLink />
    </nav>
  </header>
)
}
function UserProfileLink() {
  const navigate = useNavigate();
  const [photoURL, setPhotoURL] = useState(null);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setPhotoURL(user?.photoURL || null);
    });
    return () => unsubscribe();
  }, []);

  if (!photoURL) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <img
          src={photoURL}
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="transition-colors duration-150">
        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer text-red-500 font-semibold hover:text-red-600"
        >
          LogOut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="stroke-black dark:stroke-white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    const listener = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', listener);
    return () => darkModeQuery.removeEventListener('change', listener);
  }, []);
  const iconSrc = isDarkMode ? './i0DarkMode.svg' : './i0LightMode.svg';
  return (
    <img src={iconSrc} className="w-7" alt="Mountain" />
  );
}
export default Navbar;