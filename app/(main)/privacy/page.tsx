import { Footer } from "@/components/Footer";
import React from "react";

function Privacy() {
	return (
		<div>
			<main className="min-h-screen bg-background mx-auto max-w-5xl flex flex-col items-center justify-center p-6">
				<h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
				<p className="mb-4 text-lg text-center">
					Your privacy is important to us. This Privacy Policy explains how we
					collect, use, and protect your information.
				</p>

				<div className="space-y-6 max-w-4xl">
					<section>
						<h2 className="text-2xl font-semibold mb-2">
							Information We Collect
						</h2>
						<p>
							We collect information you provide, like your name, email, and
							usage data to improve your experience.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-2">
							How We Use Your Information
						</h2>
						<p>
							We use your data to personalize your experience, provide customer
							support, and improve our services.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-2">Data Security</h2>
						<p>
							We take security seriously and use industry-standard measures to
							protect your data.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
						<p>
							You can access, update, or delete your data anytime through your
							account settings.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
						<p>
							If you have any questions, feel free to contact us at
							support@devstats.com.
						</p>
					</section>
				</div>
			</main>

			<Footer />
		</div>
	);
}

export default Privacy;
