import Link from "next/link";

export function ViewRepo({ repo }: { repo: any }) {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold">
        <Link href={repo.html_url} target="_blank" className="text-blue-500">
          {repo.name}
        </Link>
      </h3>
      <p className="text-gray-600">
        <span className="font-semibold">Description:</span>
        {repo.description || "No description available."}
      </p>
      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
        <span>⭐ {repo.stargazers_count}</span>
        <span>🍴 {repo.forks_count}</span>
      </div>
    </div>
  );
}
