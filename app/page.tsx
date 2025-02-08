import Dashboard from "@/components/Dashboard";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Dashboard />
      <Features />
      <Testimonials />
      <Pricing />
    </div>
  );
}
