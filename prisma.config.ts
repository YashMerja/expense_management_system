import { defineConfig } from "prisma/config";
import "dotenv/config";

// Minimal shim to load envs if dotenv is not available, or assume loaded
// NextJS loads envs.
// But running via node script might not.
// Let's try to trust process.env if already loaded or basic try.

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
