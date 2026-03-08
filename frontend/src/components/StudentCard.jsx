import StatusBadge from "./StatusBadge";

export default function StudentCard({ student }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{student.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{student.email}</p>
        </div>
        <StatusBadge status={student.kyc_status} />
      </div>
      <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
        <span className="font-medium">Face Enrollment:</span>
        <StatusBadge
          status={student.face_registered ? "verified" : "pending"}
        />
      </div>
    </div>
  );
}
