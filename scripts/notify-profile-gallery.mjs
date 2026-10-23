import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

// Wait for the built site to reach Pages before asking the profile to capture it.
const built = await readFile("dist/index.html", "utf8");
const scripts = [...built.matchAll(/src="(\/assets\/[^"<>]+\.js)"/g)].map(
  (match) => match[1],
);
if (!scripts.length) throw new Error("No built JavaScript assets found");
let deployed = false;
const deadline = Date.now() + 6 * 60 * 1000;
while (Date.now() < deadline) {
  try {
    const response = await fetch("https://okorion.github.io/", {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    const html = await response.text();
    if (response.ok && scripts.every((asset) => html.includes(asset))) {
      deployed = true;
      break;
    }
  } catch {
    // Pages propagation and transient network failures share the bounded retry.
  }
  await delay(Math.min(10000, Math.max(0, deadline - Date.now())));
}
if (!deployed)
  throw new Error(
    "Published Pages assets did not match this build within six minutes",
  );
console.log("Published portfolio matches the build");
if (process.argv.includes("--check-site")) process.exit(0);
const token = process.env.PROFILE_REFRESH_TOKEN;
if (!token) throw new Error("Missing profile refresh token");
const response = await fetch(
  "https://api.github.com/repos/okorion/okorion/dispatches",
  {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(30000),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ event_type: "portfolio-deployed" }),
  },
);
if (response.status !== 204)
  throw new Error(`Profile refresh dispatch failed (${response.status})`);
console.log("Profile gallery refresh requested");
