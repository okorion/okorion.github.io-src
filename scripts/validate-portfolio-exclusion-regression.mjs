import {
  assertNoBlockedCareerPortfolioContent,
  loadCareerPortfolioTextSurfaces,
} from "./portfolio-exclusion-policy.mjs";

const cssExclusionMutation = String.raw`
.excluded-regression {
  background-image: url("https://raw.githubusercontent.com/okorion/localmesh-studio/main/public/og.png");
}`;

const mutatedSurfaces = await loadCareerPortfolioTextSurfaces({
  contentMutations: {
    "src/portfolio/portfolio.css": cssExclusionMutation,
  },
});

let mutationBlocked = false;
try {
  assertNoBlockedCareerPortfolioContent(
    mutatedSurfaces,
    "CSS exclusion negative fixture",
  );
} catch (error) {
  if (!String(error?.message).includes("localmesh-studio")) {
    throw error;
  }
  mutationBlocked = true;
}

if (!mutationBlocked) {
  throw new Error("CSS exclusion negative fixture was not rejected");
}

console.log("CSS exclusion negative fixture was correctly rejected.");
