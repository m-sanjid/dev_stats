import { PageHeader } from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import ContactMethods from "@/components/ContactMethods";
import MotionDiv from "@/components/MotionDiv";

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

      <div className="mx-auto max-w-4xl px-4 py-12">
        <MotionDiv
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <ContactForm />
          <ContactMethods />
        </MotionDiv>
      </div>
    </div>
  );
}
