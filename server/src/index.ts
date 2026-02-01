import { createApp } from "./server";
import { settings } from "./config/env";

function assertRequiredEnv() {
  const missing: string[] = [];

  if (!settings.supabaseUrl || settings.supabaseUrl.includes("your-project")) {
    missing.push("SUPABASE_URL");
  }

  if (!settings.supabaseServiceRoleKey || settings.supabaseServiceRoleKey.includes("your-service-role-key")) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

assertRequiredEnv();

const app = createApp();

app.listen(settings.port, () => {
  console.log(`API listening on http://localhost:${settings.port}`);
});
