import BorderDiv from "@/components/BorderDiv";
import Pricing from "@/components/Pricing";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | DevStats",
  description:
    "Choose the right DevStats plan for your needs. Compare features and pricing for Free and Pro plans.",
  openGraph: {
    title: "Pricing | DevStats",
    description:
      "Choose the right DevStats plan for your needs. Compare features and pricing for Free and Pro plans.",
    url: "https://devstats.com/pricing",
    siteName: "DevStats",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="space-y-12">
          <div className="p-4">
            <Pricing />
          </div>
          <BorderDiv>
            <Card className="rounded-2xl">
              <CardContent className="p-8">
                <h3 className="mb-6 text-2xl font-bold">Enterprise Features</h3>
                <div className="grid gap-4 md:gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <FeatureItem text="Dedicated Account Manager" />
                    <FeatureItem text="Custom Integration Support" />
                    <FeatureItem text="Priority 24/7 Support" />
                    <FeatureItem text="Advanced Security Features" />
                  </div>
                  <div className="space-y-4">
                    <FeatureItem text="Custom Analytics Dashboard" />
                    <FeatureItem text="SLA Guarantees" />
                    <FeatureItem text="Team Training Sessions" />
                    <FeatureItem text="Custom API Access" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </BorderDiv>

          {/* FAQ Section */}
          <div className="space-y-8">
            <SectionHeader title="Frequently Asked Questions" subtitle=""/>
            <div className="grid gap-6 md:grid-cols-2">
              <FaqItem
                question="How does the pricing work?"
                answer="Our pricing is based on a monthly subscription model. You can upgrade, downgrade, or cancel at any time."
              />
              <FaqItem
                question="What payment methods do you accept?"
                answer="We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
              />
              <FaqItem
                question="Can I change plans later?"
                answer="Yes, you can switch between plans at any time. Changes will be reflected in your next billing cycle."
              />
              <FaqItem
                question="Is there a free trial?"
                answer="No, there is no free trial."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <Check className="md:h-5 md:w-5 h-4 w-4 text-green-400" />
    <span className="text-muted-foreground text-sm md:text-base">{text}</span>
  </div>
);

const FaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <BorderDiv>
    <Card className="transition-color h-full rounded-2xl border duration-200 ease-in-out hover:border-primary">
      <CardContent className="p-6">
        <h4 className="mb-3 text-base md:text-lg font-medium">{question}</h4>
        <p className="text-muted-foreground text-sm md:text-base">{answer}</p>
      </CardContent>
    </Card>
  </BorderDiv>
);
