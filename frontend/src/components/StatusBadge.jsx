export default function StatusBadge({ status }) {
  let color = "bg-slate-100 text-slate-600 border border-slate-200";
  if (status === "verified" || status === true) {
    color = "bg-emerald-50 text-emerald-700 border border-emerald-200";
  } else if (status === "rejected" || status === false) {
    color = "bg-red-50 text-red-700 border border-red-200";
  } else if (status === "pending") {
    color = "bg-amber-50 text-amber-700 border border-amber-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${color}`}
    >
      {String(status)}
    </span>
  );
}
