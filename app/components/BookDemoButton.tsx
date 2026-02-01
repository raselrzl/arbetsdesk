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
        className="bg-[#00687a] hover:bg-[#0b8095] text-gray-100 border border-white px-5 py-3 rounded-full text-xs font-semibold shadow shadow-teal-200 transition flex items-center gap-2"
      >
        Book a Demo
      </Link>
    </motion.div>
  );
}
