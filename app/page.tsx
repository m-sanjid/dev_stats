import Dashboard from "@/components/Dashboard";
import { Footer } from "@/components/Footer";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <main className="flex flex-col min-h-screen">
        <div>
          <Hero />
        </div>
        
        {/* Add background variations and spacing between sections */}
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
          <Dashboard />
        </section>
        
        <section className="bg-white dark:bg-gray-900 py-20">
          <Features />
        </section>
        
        <section className="bg-gray-50 dark:bg-gray-800 py-20">
          <Testimonials />
        </section>
        
        <section className="bg-white dark:bg-gray-900 py-20" id="pricing">
          <Pricing />
        </section>
      </main>
      <Footer />
    </>
  );
}
