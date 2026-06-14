/**
 * Turborepo-compatible build wrapper for Windows.
 * Calls Vite's Node API directly, bypassing the npm -> cmd.exe -> vite.cmd chain
 * that breaks Turbo's pipe inheritance on Windows (CreateProcess limitation).
 */
import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

await build({
  root: resolve(__dirname, '..'),
  configFile: resolve(__dirname, '..', 'vite.config.js'),
});
