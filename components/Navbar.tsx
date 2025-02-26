"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	GitFork,
	User,
	LogOut,
	ChevronDown,
	Sun,
	Moon,
	FileText,
	Settings,
	Menu,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import SignoutButton from "./Buttons/SignoutButton";
import Image from "next/image";

const navItems = [
	{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ title: "Pro", href: "/pricing", icon: GitFork },
	{ title: "Settings", href: "/settings", icon: Settings },
];

const outNavItems = [
	{ title: "Pricing", href: "/pricing" },
	{ title: "Preview", href: "/preview" },
	{ title: "Contact", href: "/contact" },
	{ title: "About Us", href: "/about" },
	{ title: "Blog", href: "/blog" },
];

export default function Navbar() {
	const { data: session } = useSession();
	const pathname = usePathname();
	const isAuthenticated = !!session;
	const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);
	const [mounted, setMounted] = useState(false);

	const currentPlan = session?.user?.subscription;

	useEffect(() => {
		setMounted(true);
		const root = document.documentElement;
		const currentTheme =
			localStorage.getItem("theme") ||
			(root.classList.contains("dark") ? "dark" : "light");
		setIsDarkMode(currentTheme === "dark");
		root.classList.toggle("dark", currentTheme === "dark");
	}, []);

	if (!mounted) {
		return (
			<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur" />
		);
	}

	const toggleTheme = () => {
		if (isDarkMode !== undefined) {
			const newTheme = isDarkMode ? "light" : "dark";
			setIsDarkMode(!isDarkMode);
			document.documentElement.classList.toggle("dark", !isDarkMode);
			localStorage.setItem("theme", newTheme);
		}
	};

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto flex h-14 items-center px-4 md:px-16 justify-between">
				{/* Logo */}
				<Link
					href={`${isAuthenticated ? "/home" : "/"}`}
					className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
				>
					DevStats
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex space-x-2">
					{isAuthenticated &&
						navItems.map(({ title, href, icon: Icon }) => (
							<Button
								key={href}
								variant={pathname === href ? "secondary" : "ghost"}
								size="sm"
								className="gap-2"
								asChild
							>
								<Link href={href}>
									<Icon className="h-4 w-4" /> {title}
								</Link>
							</Button>
						))}

					{/* AI Portfolio link visible only when authenticated */}
					{isAuthenticated && (
						<Button variant="ghost" size="sm" className="gap-2" asChild>
							<Link
								href={`/profile/${session.user.username || session.user.id}`}
							>
								<FileText className="h-4 w-4" />
								AI Portfolio
							</Link>
						</Button>
					)}

					{/* For unauthenticated users, show outNavItems */}
					{!isAuthenticated &&
						outNavItems.map(({ title, href }) => (
							<Button
								key={href}
								variant={pathname === href ? "secondary" : "ghost"}
								size="sm"
								asChild
							>
								<Link href={href}>{title}</Link>
							</Button>
						))}
				</div>

				{/* Mobile Navigation Dropdown */}
				<div className="md:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							{isAuthenticated
								? navItems.map(({ title, href, icon: Icon }) => (
									<DropdownMenuItem key={href} asChild>
										<Link href={href} className="flex items-center gap-2">
											<Icon className="h-4 w-4" /> {title}
										</Link>
									</DropdownMenuItem>
								))
								: outNavItems.map(({ title, href }) => (
									<DropdownMenuItem key={href} asChild>
										<Link href={href}>{title}</Link>
									</DropdownMenuItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Auth Section */}
				<div className="flex items-center gap-2">
					{isAuthenticated ? (
						<>
							{currentPlan === "pro" && (
								<div className="bg-white/10 py-px backdrop-blur-sm text-sm text-purple-500 px-2 border-2 border-purple-500 rounded-2xl text-center">
									pro
								</div>
							)}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="gap-2">
										<Image
                    width={24}
                    height={24}
											src={session.user?.image || "/default-avatar.png"}
											alt="Avatar"
											className="h-6 w-6 rounded-full"
										/>
										<span className="hidden md:inline-block">
											{session.user?.name}
										</span>
										<ChevronDown className="h-4 w-4 opacity-50" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuLabel>My Account</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<User className="mr-2 h-4 w-4" /> Profile
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => signOut()}>
										<LogOut className="mr-2 h-4 w-4" /> Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<SignoutButton />
					)}

					{/* Theme Toggle */}
					<Button variant="ghost" size="sm" onClick={toggleTheme}>
						{isDarkMode ? (
							<Sun className="h-4 w-4" />
						) : (
							<Moon className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>
		</nav>
	);
}
