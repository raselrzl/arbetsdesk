// components/FeaturesSection.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const features = [
  { title: "Time Log", desc: "Track work hours accurately in real time.", img: "/icons/1.png", href: "/features/timelog" },
  { title: "Scheduling", desc: "Plan shifts and avoid conflicts easily.", img: "/icons/7.png", href: "/features/schedule" },
  { title: "Payment Management", desc: "Automated salary calculations and payouts.", img: "/icons/9.png", href: "/features/payroll" },
  { title: "Analytics", desc: "Understand performance with smart insights.", img: "/icons/3.png", href: "/features/analytics" },
  { title: "Employee Management", desc: "Manage employees from one dashboard.", img: "/icons/10.png", href: "/features/employee" },
];

export function FeaturesSection() {
  return (
    <section style={{ padding: "6rem 1rem", backgroundColor: "#f8fafc", borderTop: "1px solid #e5e7eb" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#065f46",
            marginBottom: "3rem",
            textAlign: "center",
            textTransform: "uppercase",
          }}
          className="px-4 text-2xl md:text-4xl"
        >
          Everything you need to manage your workforce
        </motion.h2>

        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              style={{
                backgroundColor: "#065f46",
                borderRadius: "1rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "64px", height: "64px", marginBottom: "1rem", position: "relative" }}>
                  <Image src={feature.img} alt={feature.title} fill style={{ objectFit: "contain" }} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.5rem", textAlign: "center" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "1rem", color: "#d1fae5", textAlign: "center" }}>{feature.desc}</p>
              </div>
              <Link
                href={feature.href}
                style={{
                  marginTop: "1.25rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#a7f3d0",
                  textAlign: "center",
                  display: "inline-block",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#a7f3d0")}
              >
                Learn more →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
