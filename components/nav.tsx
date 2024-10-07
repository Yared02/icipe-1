"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    route: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const [selectedColor, setSelectedColor] = useState<string>("bg-blue-500"); // Default selected background
  const [hoverColor, setHoverColor] = useState<string>("hover:bg-blue-600 hover:text-red-500"); // Default hover background
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Track selected item index

  useEffect(() => {
    // Ensure `localStorage` is available in the client-side
    if (typeof window !== "undefined") {
      const organization = localStorage.getItem("organization");

      // Set selected and hover background colors dynamically based on organization
      if (organization === "IIRR") {
        setSelectedColor("bg-blue-500"); // Blue for IIRR
        setHoverColor("hover:bg-blue-600 hover:text-white"); // Red hover color
      } else {
        setSelectedColor("bg-green-500"); // Green for others
        setHoverColor("hover:bg-green-600 hover:text-white"); // Red hover color
      }

      // Retrieve selected index from localStorage
      const savedIndex = localStorage.getItem("selectedIndex");
      if (savedIndex) {
        setSelectedIndex(parseInt(savedIndex));
      } else {
        setSelectedIndex(0); // Default to the first item if no saved index
      }
    }
  }, []);

  const handleClick = (index: number) => {
    setSelectedIndex(index);
    localStorage.setItem("selectedIndex", index.toString()); // Save selected index to localStorage
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 bg-white" // Keep the nav background white
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const isSelected = index === selectedIndex;

          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.route}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9 text-white", // Set text color to white
                    isSelected
                      ? `${selectedColor} text-white` // Apply dynamic background to selected item
                      : "dark:bg-muted dark:text-muted-foreground", // Default for non-selected items
                    hoverColor // Apply hover color
                  )}
                  onClick={() => handleClick(index)}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.route}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                "text-red justify-start", // Text is white for all items
                isSelected
                  ? `${selectedColor} text-white` // Apply dynamic background and white text to selected item
                  : "dark:bg-muted dark:text-muted-foreground", // Default for non-selected items
                hoverColor // Apply hover color
              )}
              onClick={() => handleClick(index)}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span className={cn("ml-auto text-white")}>
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
