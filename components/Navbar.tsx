"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import SigninButton from "./Buttons/SigninButton";

const navItems = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Dashboard", href: "/dashboard" },
  { id: 3, name: "Pricing", href: "#" },
  { id: 4, name: "About", href: "#" },
];

const commonNavItems = [
  { id: 1, name: "Pricing", href: "/" },
  { id: 2, name: "Try Demo", href: "/" },
];

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex justify-between items-center p-6 shadow-md">
      <div className="box-content bg-red-400">Logo</div>
      <div className="flex gap-2">
        <ul className="flex justify-center items-center gap-2">
          {(isLoggedIn ? navItems : commonNavItems).map((item) => (
            <Button variant="ghost" key={item.id} asChild>
              <a href={item.href}>{item.name}</a>
            </Button>
          ))}
        </ul>
        <SigninButton
          isLoggedIn={isLoggedIn}
          onClick={() => setIsLoggedIn(!isLoggedIn)}
        />
      </div>
    </div>
  );
}

export default Navbar;
