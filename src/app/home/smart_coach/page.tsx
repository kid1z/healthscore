"use client";

import { useMemo } from "react";
import Thinking from "@/components/thinking";
import { CurrentStatusCard } from "./components/current-status-card";
import { NoSuggestions } from "./components/no-suggestions";
import { SimpleModal } from "./components/simple-modal";
import { useCoachData } from "./hooks/use-coach-data";
import { useModal } from "./hooks/use-modal";
import { generateSuggestions } from "./utils/generate-suggestions";
import { getStatusInfo } from "./utils/get-status-info";

// --- Component Trang chính (CoachPage) ---
export default function CoachPage() {
  const { data, isLoading } = useCoachData();
  const modal = useModal();

  const status = useMemo(() => getStatusInfo(data.netEnergy), [data.netEnergy]);
  const suggestions = useMemo(
    () => generateSuggestions(data, modal.open),
    [data, modal.open]
  );

  // if (isLoading) {
  //   return <Thinking loading={true} />;
  // }

  console.log("data: ", data);

  return (
    <main className="px-5 pb-24">
      <Thinking loading={isLoading} />
      <header className="pt-4">
        <h1 className="font-bold text-3xl">Smart Coach</h1>
      </header>

      <section className="mt-6">
        <CurrentStatusCard status={status} />
      </section>

      <h2 className="mt-8 font-semibold text-lg">AI Suggestions</h2>
      <div className="mt-3 space-y-4">
        {suggestions.length > 0 ? suggestions : <NoSuggestions />}
      </div>

      <SimpleModal
        bgColor={status.bg}
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.content.title}
      >
        <p className="text-fuchsia-600">{modal.content.detail}</p>
      </SimpleModal>
    </main>
  );
}
