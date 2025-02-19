"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function GitLabIntegration() {
  const { data: session } = useSession();
  const [gitlabData, setGitlabData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnectGitLab = async () => {
    // Redirect to GitLab OAuth URL
    window.location.href = "/api/auth/signin/gitlab"; // Adjust this URL based on your auth setup
  };

  const fetchGitLabData = async () => {
    if (session) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/gitlab/data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // Use the access token from the session
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data from GitLab");
        }
        const data = await response.json();
        setGitlabData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchGitLabData();
  }, [session]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">GitLab Integration</h1>
      <p className="text-lg mb-4">
        Connect your GitLab account to fetch your repositories and contributions.
      </p>
      <Button onClick={handleConnectGitLab} className="bg-purple-600 hover:bg-purple-700 text-white">
        Connect to GitLab
      </Button>

      {loading && <p className="mt-4">Loading your GitLab data...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {gitlabData && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold">Your GitLab Repositories</h2>
          <ul className="mt-4 space-y-2">
            {gitlabData.map((repo) => (
              <li key={repo.id} className="p-4 border rounded-md shadow-md">
                <h3 className="text-lg font-semibold">{repo.name}</h3>
                <p className="text-gray-600">{repo.description || "No description available"}</p>
                <a href={repo.web_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Repository
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 