/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
// import Badge from "../ui/badge/Badge";
import { BoxIconLine, GroupIcon } from "@/icons";
import api from "@/apiLink";
import { useAuth } from "@/context/AuthContext";

export const EcommerceMetrics = () => {
  const [consultantCount, setConsultantCount] = useState<number>(0);
  const [assignedCount, setAssignedCount] = useState<number>(0);

  const { authData } = useAuth();
  if (!authData || authData.user.role !== "manager") return null;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [consultantRes, assignedRes] = await Promise.all([
          fetch(api + "users/get-consultant-count", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(api + "users/get-consultant-enaged", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        if (!consultantRes.ok || !assignedRes.ok) {
          throw new Error("Failed to fetch one or more metrics");
        }

        const consultantData = await consultantRes.json();
        const assignedData = await assignedRes.json();

        setConsultantCount(consultantData.count || 0);
        setAssignedCount(assignedData.count || 0);
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Consultants */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Consultants
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {consultantCount}
            </h4>
          </div>
        </div>
      </div>

      {/* Assigned to Trainings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Assigned to Training
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {assignedCount}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
