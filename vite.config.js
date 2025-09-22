import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ganti 'rfid-tracking2' sesuai dengan nama repo kamu
export default defineConfig({
  plugins: [react()],
  base: '/rfid-tracking2/'
})
