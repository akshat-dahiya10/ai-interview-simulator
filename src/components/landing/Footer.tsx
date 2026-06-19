"use client";

import { Sparkles } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["Features", "How it works", "Roles", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 px-6 pb-10 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <a href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-azure-500">
                <Sparkles className="text-white" size={16} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                MockMind
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/45">
              The AI interview simulator that helps you walk into every room
              calm, prepared, and confident.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-10 sm:gap-16">
            {columns.map((c) => (
              <div key={c.title}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                  {c.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-white/55 transition-colors hover:text-white"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 text-xs text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} MockMind. All rights reserved.</p>
          <p>Built for candidates who refuse to wing it.</p>
        </div>
      </div>
    </footer>
  );
}
