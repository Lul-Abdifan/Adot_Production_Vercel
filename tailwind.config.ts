import type { Config } from 'tailwindcss'
import {nextui} from "@nextui-org/react";


const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#AE709F',
        success: '#4CD964',
        warning: "#E9B376",
        secondary: '#333333',
        title: '#333333',
        tableTitle:'#808080',
        subtitle: '#666666',
        bgTile: '#F9F9F9',
        archive:'#FF3B30',
        lightPrimary: '#EFE2EC',
        lightPrimaryBg: '#FFF7FD'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [nextui()],
  darkMode: "class",
}

export default config