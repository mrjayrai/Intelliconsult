"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiLink";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "@/icons";

// Dynamically import the ApexCharts component
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MonthlyTarget() {
  const { authData } = useAuth();
  const monthlyTarget = 150;

  const [monthlyHours, setMonthlyHours] = useState<number[]>([]);
  const [currentMonthPercent, setCurrentMonthPercent] = useState(0);
  const [todayHours, setTodayHours] = useState(0);
  // const [isOpen, setIsOpen] = useState(false);

  const totalHours = monthlyHours.reduce((sum, hr) => sum + hr, 0);

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const userId = authData?.user._id;

        const res = await fetch(api + "users/get-monthly-training-hours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        const hours: number[] = data.monthlyHours || Array(12).fill(0);
        const currentMonth = new Date().getMonth();

        const percent = Math.min(((hours[currentMonth] / monthlyTarget) * 100).toFixed(2), 100);
        setMonthlyHours(hours);
        setCurrentMonthPercent(parseFloat(percent));
      } catch (err) {
        console.error("Failed to fetch monthly hours", err);
      }
    };

    const fetchTodayHours = async () => {
      try {
        const res = await fetch(api + "users/get-today-training-hours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: authData?.user._id }),
        });

        const data = await res.json();
        setTodayHours(data.hours || 0);
      } catch (err) {
        console.error("Failed to fetch today's hours", err);
      }
    };

    if (authData?.user._id) {
      fetchTrainingData();
      fetchTodayHours();
    }
  }, [authData]);

  const radialOptions: ApexOptions = {
    chart: { type: "radialBar", sparkline: { enabled: true }, height: 330 },
    colors: ["#465FFF"],
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val) => val + "%",
          },
        },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  const percentageDelta = currentMonthPercent - 60;
  const isPositive = percentageDelta >= 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 pb-11 bg-white shadow-default rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Target</h3>
            <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
              Target you’ve set for each month
            </p>
          </div>
          {/* <div className="relative inline-block">
            <button onClick={() => setIsOpen(!isOpen)}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
              <DropdownItem onItemClick={() => setIsOpen(false)}>View More</DropdownItem>
              <DropdownItem onItemClick={() => setIsOpen(false)}>Delete</DropdownItem>
            </Dropdown>
          </div> */}
        </div>

        {/* Radial Chart */}
        <div className="relative mt-6">
          <ReactApexChart options={radialOptions} series={[currentMonthPercent]} type="radialBar" height={330} />
          {currentMonthPercent >= 100 ? (
            <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
              Completed!
            </span>
          ) : (
            <span
              className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium
                ${isPositive
                  ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-500"
                  : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-500"}`}
            >
              {(isPositive ? "+" : "") + percentageDelta.toFixed(0) + "%"}
            </span>
          )}
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          You’ve completed {currentMonthPercent.toFixed(1)}% of your {monthlyTarget} hr target.
        </p>
      </div>

      {/* Bottom Summary */}
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        {/* Target */}
        <SummaryCard label="Target" value={`${monthlyTarget} H`} arrow={downArrow} color="#D92D20" />
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        {/* Total */}
        <SummaryCard label="Total" value={`${totalHours} H`} arrow={upArrow} color="#039855" />
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        {/* Today */}
        <SummaryCard label="Today" value={`${todayHours} H`} arrow={upArrow} color="#039855" />
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  arrow,
  color,
}: {
  label: string;
  value: string;
  arrow: string;
  color: string;
}) {
  return (
    <div>
      <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">{label}</p>
      <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
        {value}
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
          <path fillRule="evenodd" clipRule="evenodd" d={arrow} fill={color} />
        </svg>
      </p>
    </div>
  );
}

const downArrow =
  "M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36V2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5V11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z";

const upArrow =
  "M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004V13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5V4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z";
