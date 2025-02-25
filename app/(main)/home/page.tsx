"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { ArrowRight, Layout, Lock } from "lucide-react";

export default function HomePage() {
	const { data: session, status } = useSession();
	const isAuthenticated = status === "authenticated";

	return (
		<div>
			<div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
				<main className="container mx-auto px-4 py-16 max-w-5xl">
					<div className="flex flex-col items-center justify-center space-y-8 text-center">
						<div className="space-y-4">
							<h1 className="text-3xl font-bold py-10 tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
								Welcome to Your
								<span className="text-purple-600 dark:text-purple-400">
									{" "}
									Dashboard
								</span>
							</h1>
							<p className="mx-auto max-w-[700px] pb-8 text-slate-600 dark:text-slate-400 md:text-xl">
								Manage your portfolios, track performance, and actionable
								insights all in one place.
							</p>
						</div>

						{isAuthenticated ? (
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-3 w-full max-w-5xl">
								{homeItems.map((item) => (
									<Card
										key={item.title}
										className="transform transition-all hover:scale-105"
									>
										<CardHeader>
											<div className="flex justify-between py-2">
												<Layout className="h-8 w-8 text-purple-600" />
												{item.label && (
													<div className="flex items-center rounded-lg bg-purple-500/10 px-3 text-xs font-medium text-purple-600">
														{item.label}
													</div>
												)}
											</div>
											<CardTitle>{item.title}</CardTitle>
											<CardDescription>{item.desc}</CardDescription>
										</CardHeader>
										<CardContent>
											<Link
												href={
													item.href === "port"
														? `/profile/${session.user.username || session.user.id}`
														: item.href
												}
											>
												<Button className="w-full bg-purple-600 hover:bg-purple-700">
													{item.button}
													<ArrowRight className="ml-2 h-4 w-4" />
												</Button>
											</Link>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<Card className="w-full max-w-md">
								<CardHeader>
									<Lock className="h-8 w-8 text-slate-400 mx-auto" />
									<CardTitle>Access Required</CardTitle>
									<CardDescription>
										Please sign in to access your personalized dashboard and
										features.
									</CardDescription>
								</CardHeader>
								<CardContent className="flex justify-center">
									<Button className="bg-purple-600 hover:bg-purple-700">
										Sign In
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</CardContent>
							</Card>
						)}
					</div>
				</main>
			</div>

			<Footer />
		</div>
	);
}

const homeItems = [
	{
		title: "Dashboard",
		desc: "View your portfolio overview and analytics",
		href: "/dashboard",
		button: "Go to Dashboard",
	},
	{
		title: "AI Portfolio",
		label: "pro",
		desc: "Create AI portfolio based on your work",
		href: "port",
		button: "Portfolio",
	},
	{
		title: "Repository Metrics",
		label: "pro",
		desc: "Deep dive into your repositories performance, Track stars, forks...",
		href: "/dashboard/repos",
		button: "Repositories",
	},
	{
		title: "AI README",
		label: "pro",
		desc: "Generate AI README for your repos",
		href: "/dashboard/readme",
		button: "AI README",
	},
	{
		title: "Languages",
		desc: "view your programming languages",
		href: "/dashboard/languages",
		button: "Languages",
	},
	{
		title: "Smart Analytics",
		label: "pro",
		desc: "View detailed Analytics",
		href: "/dashboard/analytics",
		button: "Analytics",
	},
	{
		title: "Code Review",
		label: "pro",
		desc: "AI powered code review for PRs",
		href: "/dashboard/code-review",
		button: "Code Review",
	},
];
