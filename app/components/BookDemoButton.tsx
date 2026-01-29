"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BookDemoButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        href="/book-demo"
        className="bg-teal-400 hover:bg-teal-700 border border-white text-teal-900 px-3 py-2 rounded-full text-xs font-semibold shadow shadow-white transition flex items-center gap-2"
      >
        Book a Demo
      </Link>
    </motion.div>
  );
}
