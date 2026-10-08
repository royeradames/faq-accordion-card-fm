import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4537", headless: true, channel: "chrome" },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 4537",
    url: "http://127.0.0.1:4537",
    reuseExistingServer: false,
  },
});
