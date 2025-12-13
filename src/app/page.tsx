/** biome-ignore-all lint/style/useConsistentTypeDefinitions: <ba> */
"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

// =================================================================
//                 1. COMPONENT THANH ĐIỀU HƯỚNG DƯỚI (NAVBAR)
// =================================================================

// =================================================================
//                 2. COMPONENT CHÍNH (LANDING PAGE)
// =================================================================

export default function LandingPage() {
  return (
    // Khung màn hình giả lập mobile
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-between bg-white p-6">
      {/* Vùng nội dung chính */}
      <div className="mt-12 mb-20 flex flex-col items-center text-center">
        {/* Ảnh minh họa (Placeholder) */}
        <div className="mb-8 flex h-64 w-64 items-center justify-center overflow-hidden rounded-3xl bg-gray-100 shadow-lg">
          {/*  */}
          <Image
            alt="hero"
            className="h-full w-full object-cover"
            height={256}
            src="/uploads/WavingGirl.gif"
            width={256}
          />
        </div>

        {/* Tiêu đề và Mô tả */}
        <h1 className="mb-4 font-extrabold text-4xl text-gray-900 leading-tight">
          Go see the new thing with{" "}
          <div className="inline-flex items-center gap-2">
            <span className="bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              CyberHealth
            </span>{" "}
            <svg
              className="icon icon-tabler icons-tabler-filled icon-tabler-heart"
              fill="#ff0000"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>heart</title>
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
            </svg>
          </div>
        </h1>

        <p className="mb-12 max-w-xs text-gray-500 text-lg">
          Your personal AI Body Guard. <br />
          Simple. Smart. Clean.
        </p>

        {/* 2 buttons: new user or existing user */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full max-w-xs flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/bio">
            <motion.button
              className="flex w-full transform items-center justify-center rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 px-8 py-3 font-semibold text-md text-white shadow-md transition-colors hover:bg-fuchsia-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New User →
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Tạo khoảng trống ở cuối để Navbar không bị che mất nội dung */}
      {/* <div className="h-10" /> */}
    </div>
  );
}
