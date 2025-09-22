// TEMP DEBUG - Execute immediately to verify file is loaded
console.log("[auth.config] FILE IS BEING LOADED!");

// TEMP DEBUG
console.log("[auth.config] Environment variables check:");
console.log("  CLERK_JWT_ISSUER_DOMAIN =", process.env.CLERK_JWT_ISSUER_DOMAIN);
console.log("  CLERK_ISSUER_URL =", process.env.CLERK_ISSUER_URL);
console.log("  CLERK_ISSUER =", process.env.CLERK_ISSUER);
console.log("  CLERK_DOMAIN =", process.env.CLERK_DOMAIN);

const domain =
  process.env.CLERK_JWT_ISSUER_DOMAIN ||
  process.env.CLERK_ISSUER_URL ||
  process.env.CLERK_ISSUER ||
  process.env.CLERK_DOMAIN;

console.log("[auth.config] Using domain:", domain);

const applicationID = "convex";

const authConfig = {
  providers: [
    {
      domain: "https://amusing-elf-39.clerk.accounts.dev",
      applicationID,
    },
  ],
};

console.log("[auth.config] Final config:", JSON.stringify(authConfig, null, 2));

export default authConfig;
