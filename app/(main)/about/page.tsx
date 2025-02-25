import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Github,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Star,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="About DevStats"
        description="Your personal GitHub analytics and productivity dashboard"
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-6 space-y-8">
        {/* Mission Statement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p className="text-lg text-muted-foreground">
              DevStats is designed to help developers understand their coding
              patterns, track productivity, and gain insights into their GitHub
              activity. We believe in making development metrics accessible and
              actionable.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<GitCommit className="h-6 w-6" />}
            title="Commit Analytics"
            description="Track your commit patterns, coding hours, and contribution trends over time."
          />
          <FeatureCard
            icon={<GitBranch className="h-6 w-6" />}
            title="Repository Insights"
            description="Get detailed analytics about your repositories, including language statistics and activity metrics."
          />
          <FeatureCard
            icon={<GitPullRequest className="h-6 w-6" />}
            title="PR Tracking"
            description="Monitor your pull requests, review times, and collaboration patterns."
          />
          <FeatureCard
            icon={<Star className="h-6 w-6" />}
            title="Performance Metrics"
            description="Understand your coding productivity with detailed performance analytics."
          />
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Step
                number="1"
                title="Connect Your GitHub"
                description="Sign in with your GitHub account to get started. We only request read access to your repositories."
              />
              <Step
                number="2"
                title="Automatic Analysis"
                description="We analyze your GitHub activity, commits, and repositories to generate insights."
              />
              <Step
                number="3"
                title="Real-time Updates"
                description="Your dashboard updates automatically as you continue your GitHub activity."
              />
              <Step
                number="4"
                title="Track Progress"
                description="Monitor your development metrics and improve your productivity over time."
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p className="text-muted-foreground">
              We take your privacy seriously. GitMetrics only accesses the
              GitHub data you explicitly authorize. We never store sensitive
              information and all data is encrypted. Read our privacy policy to
              learn more about how we protect your information.
            </p>
          </CardContent>
        </Card>

        {/* GitHub Integration */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <Github className="h-8 w-8" />
              <h3 className="text-xl font-semibold">Powered by GitHub</h3>
            </div>
            <p className="text-gray-300">
              GitMetrics integrates seamlessly with GitHub to provide you with
              accurate and up-to-date analytics about your development activity.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Step = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
      {number}
    </div>
    <div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);
