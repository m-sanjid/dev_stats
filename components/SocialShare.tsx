"use client";

import React, { useState } from "react";
import {
  Facebook,
  Linkedin,
  Share2,
  Twitter,
  ChevronUp,
  ImageIcon,
} from "lucide-react";
import { Button } from "./ui/button";

interface SocialShareDropdownProps {
  url: string;
  image?: string; // Snapshot image URL
  text?: string;
}

const SocialShareDropdown: React.FC<SocialShareDropdownProps> = ({
  url,
  image,
  text = "Check this out! 🚀",
}) => {
  const [open, setOpen] = useState(false);

  // Function to generate social media share links including the snapshot
  const generateShareLink = (platform: "twitter" | "linkedin" | "facebook") => {
    if (image) {
      return platform === "twitter"
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}`
        : platform === "linkedin"
          ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
          : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&picture=${encodeURIComponent(image)}`;
    }
    return platform === "twitter"
      ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      : platform === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  };

  return (
    <div className="relative inline-block">
      {/* Share Button */}
      <Button
        onClick={() => setOpen(!open)}
        className="bg-purple-600 text-white"
      >
        <Share2 className="h-5 w-5 mr-2" />
        Share
        <ChevronUp className="ml-2 h-4 w-4" />
      </Button>

      {/* Dropdown Menu (Opens Upward) */}
      {open && (
        <div className="absolute bottom-full mb-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden animate-fade-in-up">
          <a
            href={generateShareLink("twitter")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Twitter className="h-4 w-4 text-blue-500" /> Twitter
          </a>
          <a
            href={generateShareLink("linkedin")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Linkedin className="h-4 w-4 text-blue-700" /> LinkedIn
          </a>
          <a
            href={generateShareLink("facebook")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Facebook  className="h-4 w-4 text-blue-600" /> Facebook
          </a>
          {image && (
            <button
              onClick={() => window.open(image, "_blank")}
              className="flex w-full items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ImageIcon className="h-4 w-4 text-gray-600" /> View Snapshot
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialShareDropdown;
