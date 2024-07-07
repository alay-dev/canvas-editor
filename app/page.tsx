"use client";

import { Toaster } from "@/components/ui/sonner";
import Fabritor from "./_fabritor";

export default function Home() {
  return (
    <main className=" h-screen">
      <Fabritor />
      <Toaster />
    </main>
  );
}
