import { useEffect, useState } from "react";
import { studentApi } from "../services/api";

export default function Timeline({ timelineData }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (timelineData) {
      setEvents(timelineData);
      setLoading(false);
      return;
    }

    const fetchTimeline = async () => {
      try {
        const res = await studentApi.getTimeline();
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch timeline", err);
      } finally {
        setLoading(false);
      }
    };
    if (!timelineData) fetchTimeline();
  }, [timelineData]);

  if (loading)
    return (
      <div className="animate-pulse flex space-x-4 p-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-2 bg-slate-200 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-200 rounded col-span-2"></div>
              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (!events.length) return null;

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">
        Recent Activity
      </h2>
      <div className="relative border-l border-slate-200 ml-3 space-y-6">
        {events.map((ev, i) => (
          <div key={i} className="pl-6 relative">
            <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5 ring-4 ring-white" />
            <h3 className="text-sm font-semibold text-slate-900">{ev.title}</h3>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              {new Date(ev.timestamp).toLocaleString()}
            </span>
            <p className="text-sm text-slate-600">{ev.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
