import { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import ContactMethods from "@/components/ContactMethods";
import MotionDiv from "@/components/MotionDiv";

export const metadata: Metadata = {
  title: "Contact DevStats | Get in Touch",
  description: "Contact the DevStats team for support, feedback, or partnership inquiries. We're here to help!",
  openGraph: {
    title: "Contact DevStats",
    description: "Contact the DevStats team for support, feedback, or partnership inquiries.",
    url: "https://devstats.com/contact",
    siteName: "DevStats",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pb-16 text-foreground">
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background/95 backdrop-blur"
      >
        <PageHeader
          title="Contact Us"
          description="Get in touch with the DevStats team"
        />
      </MotionDiv>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <MotionDiv
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <ContactForm />
          <ContactMethods />
        </MotionDiv>
      </div>
    </div>
  );
}
