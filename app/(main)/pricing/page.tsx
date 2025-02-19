import { PageHeader } from "@/components/PageHeader";
import Pricing from "@/components/Pricing";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <PageHeader
        title="Simple, Transparent Pricing"
        description="Choose the plan that best fits your needs"
      />

      <div className="max-w-4xl mx-auto mt-16 space-y-8">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Enterprise Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <FeatureItem text="Dedicated Account Manager" />
                <FeatureItem text="Custom Integration Support" />
                <FeatureItem text="Priority 24/7 Support" />
                <FeatureItem text="Advanced Security Features" />
              </div>
              <div className="space-y-3">
                <FeatureItem text="Custom Analytics Dashboard" />
                <FeatureItem text="SLA Guarantees" />
                <FeatureItem text="Team Training Sessions" />
                <FeatureItem text="Custom API Access" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="p-4 my-4">
          <Pricing />
        </div>
        {/* FAQ Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6">
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
              answer="Yes, all paid plans come with a 14-day free trial. No credit card required to start."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2">
    <Check className="h-5 w-5 text-green-400" />
    <span>{text}</span>
  </div>
);

const FaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <h4 className="font-semibold mb-2">{question}</h4>
      <p className="text-muted-foreground">{answer}</p>
    </CardContent>
  </Card>
);
