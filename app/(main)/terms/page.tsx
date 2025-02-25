import { Footer } from "@/components/Footer";
import React from "react";

function TermsPage() {
	return (
		<div>
			<main className="min-h-screen bg-background mx-auto max-w-5xl p-6">
				<h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						1. Acceptance of Terms
					</h2>
					<p>
						By accessing or using our application, you agree to be bound by
						these Terms of Service and our Privacy Policy. If you do not agree,
						please do not use our app.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						2. User Responsibilities
					</h2>
					<p>
						Users must not misuse the app, engage in illegal activities, or
						attempt to compromise the security and integrity of the platform.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						3. Subscription & Payments
					</h2>
					<p>
						Subscription details, billing cycles, and payment policies are
						outlined in our billing section. Users can upgrade, downgrade, or
						cancel their plans at any time.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						4. Intellectual Property
					</h2>
					<p>
						All content, features, and intellectual property of the app are
						owned by us or our licensors. Unauthorized use of the content is
						strictly prohibited.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						5. Limitation of Liability
					</h2>
					<p>
						We are not liable for any indirect, incidental, or consequential
						damages arising from your use of the app. Use the app at your own
						risk.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">6. Updates to Terms</h2>
					<p>
						We may update these terms from time to time. Continued use of the
						app after changes constitutes acceptance of the new terms.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						7. Contact Information
					</h2>
					<p>
						If you have any questions or concerns about these terms, please
						contact us at support@example.com.
					</p>
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default TermsPage;
