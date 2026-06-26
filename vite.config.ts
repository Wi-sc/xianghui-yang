import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed as a GitHub project site: https://wi-sc.github.io/xianghui-yang/
// Project sites are served from /<repo-name>/, so base must match the repo name.
export default defineConfig({
  base: '/xianghui-yang/',
  plugins: [react()],
})
