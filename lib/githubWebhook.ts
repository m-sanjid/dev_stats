import { prisma } from "./prisma";

export async function registerGitHubWebhook(
  userId: string,
  githubUsername: string,
  repoId: string,
  accessToken: string,
) {
  console.log(
    `Registering webhook for ${githubUsername}/${repoId} with userId: ${userId}`,
  );

  const response = await fetch(
    `https://api.github.com/repos/${githubUsername}/${repoId}/hooks`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        name: "web",
        active: true,
        events: ["push", "pull_request", "star"],
        config: {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/github-webhook`,
          content_type: "json",
          secret: process.env.GITHUB_WEBHOOK_SECRET,
        },
      }),
    },
  );

  if (!response.ok) {
    console.error(
      "❌ Failed to register GitHub webhook",
      await response.json(),
    );
    return;
  }

  const webhookData = await response.json();

  console.log(`✅ Webhook registered: `, webhookData);

  await prisma.gitHubWebhook.upsert({
    where: { userId, repoId },
    update: { webhookId: webhookData.id },
    create: { userId, repoId, webhookId: webhookData.id },
  });

  console.log(`✅ Webhook stored in DB for ${githubUsername}/${repoId}`);
}
