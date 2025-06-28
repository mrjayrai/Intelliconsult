"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Briefcase,
  CalendarDays,
  CheckCircle,
  CircleUserRound,
  Mail,
  MapPin,
  Star,
  Search,
  Filter,
} from "lucide-react";
import api from "@/apiLink";

// === Types ===
type TrainingEntry = {
  ["Attendance %"]: number;
  ["Days Present"]: number;
  ["Total Days"]: number;
  Training: string;
};

type Consultant = {
  name: string;
  email: string;
  city: string;
  dateOfJoining: string;
  userId: string;
  overallAttendance: number;
  daysPresent: number;
  totalDays: number;
  projectCount: number;
  endorsedSkills: number;
  certifiedSkills: number;
  resumeSkillMatchPercent: number;
  totalTrainings: number;
  trainings: TrainingEntry[];
  remark: string;
};

const sortOptions = [
  { label: "Attendance %", value: "attendance" },
  { label: "Resume Match %", value: "resume" },
  { label: "Projects", value: "projects" },
];

function calculateWorkingDays(doj: string): number {
  const startDate = new Date(doj);
  const today = new Date();
  let totalDays = 0;
  for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
    const day = date.getDay();
    if (day !== 0 && day !== 6) totalDays++;
  }
  const monthsPassed =
    (today.getFullYear() - startDate.getFullYear()) * 12 +
    (today.getMonth() - startDate.getMonth());
  const earnedLeaves = monthsPassed * 2;
  return Math.max(0, totalDays - earnedLeaves);
}

export default function ConsultantInsights() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("attendance");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch(api + "users/get-insights", {
          method: "POST",
        });
        const json = await res.json();
        if (json?.analysis?.insights) {
          setConsultants(json.analysis.insights);
        } else {
          setError("Invalid response format.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const filteredAndSorted = useMemo(() => {
    // eslint-disable-next-line prefer-const
    let filtered = consultants.filter((c) =>
      [c.name, c.email, c.city].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );
    switch (sortBy) {
      case "attendance":
        filtered.sort((a, b) => b.overallAttendance - a.overallAttendance);
        break;
      case "resume":
        filtered.sort((a, b) => b.resumeSkillMatchPercent - a.resumeSkillMatchPercent);
        break;
      case "projects":
        filtered.sort((a, b) => b.projectCount - a.projectCount);
        break;
    }
    return filtered;
  }, [consultants, search, sortBy]);

  const avgCalculatedAttendance = useMemo(() => {
    const total = consultants.reduce((sum, c) => {
      const totalDays = calculateWorkingDays(c.dateOfJoining);
      return sum + (totalDays > 0 ? (c.daysPresent / totalDays) * 100 : 0);
    }, 0);
    return consultants.length ? Math.round(total / consultants.length) : 0;
  }, [consultants]);

  if (loading)
    return <div className="p-6 text-lg text-gray-700 dark:text-gray-300">Loading insights...</div>;
  if (error)
    return <div className="p-6 text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Consultants</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{consultants.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Attendance (calculated)</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{avgCalculatedAttendance}%</p>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search name/email/city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 text-sm rounded-md border dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm rounded-md px-2 py-1 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort by {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filteredAndSorted.map((consultant) => {
          const calculatedTotalDays = calculateWorkingDays(consultant.dateOfJoining);
          const attendancePercent = Math.round((consultant.daysPresent / calculatedTotalDays) * 100);

          return (
            <div
              key={consultant.userId}
              className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all p-6 relative"
            >
              <div className="absolute right-6 top-6">
                <CircleUserRound className="h-6 w-6 text-gray-400 dark:text-gray-600" />
              </div>

              <div className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
                {consultant.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
                <Mail className="h-4 w-4" /> {consultant.email}
              </div>

              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{consultant.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Joined: {new Date(consultant.dateOfJoining).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    Attendance: {consultant.daysPresent}/{calculatedTotalDays} ({attendancePercent}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Projects: {consultant.projectCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Resume Match: {consultant.resumeSkillMatchPercent}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⭐ Endorsed: {consultant.endorsedSkills}</span>
                  <span>🎓 Certified: {consultant.certifiedSkills}</span>
                </div>
                <div>
                  <strong>Trainings:</strong> {consultant.totalTrainings}
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    consultant.remark === "Training Needed"
                      ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      : consultant.remark === "Needs Further Evaluation"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                      : "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                  }`}
                >
                  {consultant.remark}
                </span>
              </div>

              {consultant.trainings.length > 0 && (
                <details className="mt-4 group">
                  <summary className="cursor-pointer font-semibold text-blue-600 dark:text-blue-400 group-open:mb-2 transition-all">
                    View Trainings
                  </summary>
                  <ul className="space-y-2 text-sm">
                    {consultant.trainings.map((t, idx) => (
                      <li
                        key={idx}
                        className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                      >
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {t.Training}
                        </p>
                        <p>Days Present: {t["Days Present"]}</p>
                        <p>Total Days: {t["Total Days"]}</p>
                        <p>Attendance: {t["Attendance %"]}%</p>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
