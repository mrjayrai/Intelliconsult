/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React,{useEffect,useState} from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon,ArrowUpIcon,  BoxIconLine, GroupIcon } from "@/icons";
import api from "@/apiLink";
import { useAuth } from "@/context/AuthContext";
// ArrowUpIcon,

export const EcommerceMetrics = () => {

  const [trainingData, setTrainingData] = useState<{
    totalHours: number;
    trainings: { trainingId: string; trainingName: string; hoursAttended: number }[];
  } | null>(null);

  const { authData } = useAuth();
  if(!authData){
    return;
  }

  

  const { _id } = authData.user;

useEffect(() => {
  const fetchTrainingHours = async () => {
    try {
      const response = await fetch(api + `users/get-training-hours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: _id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Correct way to parse JSON
      setTrainingData(data);
    } catch (error) {
      console.error("Failed to fetch training hours:", error);
    }
  };

  if (_id) {
    fetchTrainingHours();
  }
}, [_id]);

 
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Training Hours
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {trainingData?.totalHours ?? '0'}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Ongoing Training Module
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {trainingData?.trainings.length ?? '0'}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            {`${Math.min(
      Math.round(((trainingData?.trainings.length ?? 0) / 5) * 100),
      100
    )}%`}
          </Badge> */}
          {/* <Badge color={(trainingData?.trainings.length ?? 0) >= 5 ? "success" : "error"}>
  {(trainingData?.trainings.length ?? 0) >= 5 ? (
    <>
      <ArrowUpIcon className="text-success-500" />
      {`${Math.min(
        Math.round(
          Math.abs(((trainingData?.trainings.length ?? 0) / 5) * 100 - 100)
        ),
        20
      )}%`}
    </>
  ) : (
    <>
      <ArrowDownIcon className="text-error-500" />
      {`${Math.min(
        Math.round(
          Math.abs(((trainingData?.trainings.length ?? 0) / 5) * 100 - 100)
        ),
        20
      )}%`}
    </>
  )}
</Badge> */}

        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
