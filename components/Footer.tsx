"use client";

import { Link } from "next-view-transitions";
import { motion } from "motion/react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Preview", href: "/preview" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Blog", href: "/blog" },
    { name: "Support", href: "/help" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

const socialLinks = [
  {
    name: "GitHub",
    icon: IconBrandGithub,
    href: "https://github.com/m-sanjid/dev_stats",
    color: "hover:bg-black p-2 rounded-2xl",
  },
  {
    name: "Twitter",
    icon: IconBrandX,
    href: "https://x.com/dev_sanjid",
    color: "hover:bg-black p-2 rounded-2xl",
  },
  {
    name: "LinkedIn",
    icon: IconBrandLinkedin,
    href: "https://www.linkedin.com/in/muhammedsanjid1/",
    color: "hover:bg-blue-600 p-2 rounded-2xl",
  },
];

const container = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    delay: 0.4,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export function Footer() {
  return (
    <motion.footer
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="z-10 mx-8 max-w-6xl rounded-3xl border p-2 bg-primary/5 backdrop-blur-md text-xs"
    >
      <div className="mx-auto px-8 md:px-24 py-16 border rounded-2xl bg-white dark:bg-black">
        <motion.div
          variants={item}
          className="mb-14 grid grid-cols-2 gap-10 md:grid-cols-4"
        >
          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold md:text-base">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li
                  key={link.name}
                  className="transition-all duration-200 hover:translate-x-1"
                >
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Resources Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold md:text-base">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li
                  key={link.name}
                  className="transition-all duration-200 hover:translate-x-1"
                >
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold md:text-base">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li
                  key={link.name}
                  className="transition-all duration-200 hover:translate-x-1"
                >
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold md:text-base">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li
                  key={link.name}
                  className="transition-all duration-200 hover:translate-x-1"
                >
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
        {/* Bottom Section */}
        <motion.div variants={item} className="border-t pt-10">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-2 text-lg font-bold">DevStats</div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} DevStats. All rights reserved.
              </p>
            </div>
            {/* Social Links */}
            <div className="flex space-x-8">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-zinc-600 transition-colors hover:text-white dark:text-zinc-500 ${link.color}`}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <span className="sr-only">{link.name}</span>
                    <Icon className="h-7 w-7" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
