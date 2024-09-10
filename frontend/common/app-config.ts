/* app.config.ts */

// Set profile specific environment variables
const profilePrefix = `${process.env.EAS_BUILD_PROFILE?.toUpperCase()}_`;
Object.entries(process.env)
  .filter(([key]) => key.startsWith(profilePrefix))
  .forEach(([key, value]) => (process.env[key.slice(profilePrefix.length)] = value));
