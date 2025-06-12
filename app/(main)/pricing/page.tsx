import Pricing from "@/components/Pricing";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="p-4">
            <Pricing />
          </div>

          <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
            <CardContent className="p-8">
              <h3 className="mb-6 text-2xl font-bold">Enterprise Features</h3>
              <div className="grid gap-8 md:grid-cols-2">
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

          {/* FAQ Section */}
          <div className="space-y-8">
            <h3 className="text-center text-2xl font-bold">
              Frequently Asked Questions
            </h3>
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
    <Check className="h-5 w-5 text-green-400" />
    <span className="text-muted-foreground">{text}</span>
  </div>
);

const FaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <Card className="border-2 border-transparent transition-all duration-300 ease-in-out hover:border-primary">
    <CardContent className="p-6">
      <h4 className="mb-3 text-lg font-semibold">{question}</h4>
      <p className="text-muted-foreground">{answer}</p>
    </CardContent>
  </Card>
);
