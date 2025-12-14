import type { StatusInfo } from "../types";

type CurrentStatusCardProps = {
  status: StatusInfo;
};

export function CurrentStatusCard({ status }: CurrentStatusCardProps) {
  return (
    <div className={`rounded-2xl ${status.bg} p-3 text-white shadow-md`}>
      <p className="text-sm opacity-80">Current Status</p>
      <h2 className="mt-2 font-bold text-xl">{status.title}</h2>
      <p className="mt-2 text-sm">{status.description}</p>
    </div>
  );
}
