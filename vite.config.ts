import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5190,
    strictPort: false,
    host: "localhost", // loopback only (box is rootless; avoid binding all interfaces)
    allowedHosts: [
      "jlb-hermes.tail1caa84.ts.net", // tailnet hostname for tailscale serve :5190
      "*.ts.net",                     // any Tailscale MagicDNS name reaching this box
    ],
  },
});
