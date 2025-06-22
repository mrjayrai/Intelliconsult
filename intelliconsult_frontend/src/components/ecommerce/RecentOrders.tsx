"use client";

import { useEffect, useState } from "react";
// import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiLink";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface TrainingData {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  trainerName: string;
  skillsToBeAcquired: string[];
}

interface CompletedTraining {
  _id: string;
  trainingId: TrainingData;
  completedDate: string;
  score: number;
  certificateUrl: string;
  feedback: string;
}

export default function RecentOrders() {
  const { authData } = useAuth();
  const userId = authData?.user?._id;

  const [recentTrainings, setRecentTrainings] = useState<CompletedTraining[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCompletedTrainings = async () => {
      try {
        const response = await fetch(api + "trainings/get-completed-training", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const result = await response.json();
        const sorted = result.data.trainingsCompleted
          .sort(
            (a: CompletedTraining, b: CompletedTraining) =>
              new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
          )
          .slice(0, 5);

        setRecentTrainings(sorted);
      } catch (error) {
        console.error("Error fetching completed trainings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTrainings();
  }, [userId]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Trainings Completed
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : recentTrainings.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You haven’t completed any trainings yet.
          </p>
        ) : (
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Training
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Trainer
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Completed Date
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentTrainings.map((training) => (
                <TableRow key={training._id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {/* <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          src="/images/logo/int_logo.png"
                          className="h-[50px] w-[50px] object-cover"
                          alt={training.trainingId.name}
                        />
                      </div> */}
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {training.trainingId.name}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {training.trainingId.skillsToBeAcquired.join(", ")}
                        </span>
                      </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {training.trainingId.trainerName}
                    </TableCell>

                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {new Date(training.completedDate).toDateString()}
                    </TableCell>

                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={training.score>60?"success":"error"}>{training.score>60?"Passed":"Failed"}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
