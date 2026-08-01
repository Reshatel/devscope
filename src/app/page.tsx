"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ProfileSearch } from "@/components/ProfileSearch";
import { HunkHeader } from "@/components/HunkHeader";
import { BootSequence } from "@/components/BootSequence";

export default function Home() {
  const [isBooted, setIsBooted] = useState(false);

  return (
    <>
      {!isBooted && <BootSequence onDone={() => setIsBooted(true)} />}

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isBooted ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen py-16"
      >
        <div className="mx-auto max-w-2xl px-6">
          <HunkHeader text="@@ devscope — analyze any developer @@" />
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold text-bone">
            DevScope
          </h1>
          <p className="mt-2 font-mono text-sm text-sage">
            Analyze any developer on GitHub 
          </p>
        </div>
        <ProfileSearch />
      </motion.main>
    </>
  );
}