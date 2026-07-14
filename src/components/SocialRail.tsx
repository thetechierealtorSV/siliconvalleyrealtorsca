'use client'

import { Instagram, Youtube, Linkedin, Mail } from 'lucide-react'

const links = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: Instagram },
  { href: 'https://youtube.com', label: 'YouTube', Icon: Youtube },
  { href: 'https://tiktok.com', label: 'TikTok', Icon: TikTokIcon },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: Linkedin },
  { href: 'mailto:info@nikolaenkopropertygroup.com', label: 'Email', Icon: Mail },
]

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.84Z" />
    </svg>
  )
}

export function SocialRail() {
  return (
    <div className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-[105] flex-col items-center gap-4 px-2 py-4 rounded-full bg-foreground/70 backdrop-blur-md border border-border/40">
      <div className="w-px h-8 bg-background/40" />
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          className="text-background/85 hover:text-background hover:scale-110 transition-all duration-300"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
      <div className="w-px h-8 bg-background/40" />
    </div>
  )
}
