import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container flex flex-col gap-3 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 font-medium text-slate-800">
          <GraduationCap className="h-4 w-4 text-blue-600" />
          CollegeHub
        </div>
        <p>Built for shortlist clarity, clean comparisons, and faster college decisions.</p>
      </div>
    </footer>
  );
}
