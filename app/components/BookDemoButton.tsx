"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BookDemoButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-8 right-10 z-50"
    >
      <Link
        href="/book-demo"
        className="bg-teal-900 hover:bg-teal-700 border border-white text-white px-5 py-3 rounded-full text-sm font-semibold shadow shadow-white transition flex items-center gap-2"
      >
        Book a Demo
      </Link>
    </motion.div>
  );
}
