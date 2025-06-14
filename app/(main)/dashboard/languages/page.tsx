import { PageHeader } from "@/components/PageHeader";
import LanguagesClient from "./LanguagesClient";

export default function LanguagesPage() {
  return (
    <div className="h-full w-full p-6">
      <PageHeader title="Language Analytics" description="A breakdown of language usage across your public repositories." />
      <div className="mt-8">
        <LanguagesClient />
      </div>
    </div>
  );
}
