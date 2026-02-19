import { execSync } from 'child_process'

const pages = [
  'home', 'about', 'brand-visual', 'content-film',
  'growth-marketing', 'ai-geo', 'home-copy', 'our-work',
  'contact', 'ceo', 'privacy-policy'
]

for (const page of pages) {
  console.log(`Building ${page}...`)
  execSync(`cross-env PAGE=${page} vite build`, { stdio: 'inherit' })
}