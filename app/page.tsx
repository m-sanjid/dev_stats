import Dashboard from "@/components/Dashboard";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <main className="px-2">
        <div>
          <Hero />
        </div>

        {/* Add background variations and spacing between sections */}
        <section
          id="dashboard"
          className="bg-gradient-to-b from-white to-neutral-50 py-20 dark:from-neutral-950 dark:to-neutral-900"
        >
          <Dashboard />
        </section>

        <section id="features" className="bg-white py-20 dark:bg-neutral-950">
          <Features />
        </section>

        <section
          id="testimonials"
          className="bg-neutral-50 py-20 dark:bg-neutral-950"
        >
          <Testimonials />
        </section>

        <section id="pricing" className="bg-white py-20 dark:bg-neutral-950">
          <Pricing />
        </section>
      </main>
    </>
  );
}
