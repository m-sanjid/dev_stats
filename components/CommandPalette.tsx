"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useHotkeys } from "react-hotkeys-hook";
import { IconArrowUpRight, IconSearch } from "@tabler/icons-react";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    setOpen((open) => !open);
  });

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const navItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Settings", href: "/settings" },
    { title: "Pricing", href: "/pricing" },
    { title: "Preview", href: "/preview" },
    { title: "Contact", href: "/contact" },
    { title: "About Us", href: "/about" },
    { title: "Blog", href: "/blog" },
    { title: "Repositories", href: "/dashboard/repos" },
    { title: "Activity", href: "/dashboard/activity" },
    { title: "Analytics", href: "/dashboard/analytics" },
    { title: "Languages", href: "/dashboard/languages" },
    { title: "AI Readme", href: "/dashboard/readme" },
    { title: "Code review", href: "/dashboard/code-review" },
  ];

  return (
    <>
      <div
        className="flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-muted px-2 py-2 text-sm text-muted-foreground md:px-4"
        onClick={() => {
          setOpen(true);
        }}
      >
        <IconSearch strokeWidth={2} size={16} />
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 md:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandGroup heading="Navigation">
            <CommandEmpty>No commands</CommandEmpty>
            {navItems.map((item, idx) => (
              <CommandItem
                key={idx}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <IconArrowUpRight
                  strokeWidth={1}
                  className="size-4 rounded-2xl border bg-accent p-1"
                />{" "}
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
