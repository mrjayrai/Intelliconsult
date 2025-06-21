"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { MoreDotIcon } from "@/icons";
import api from "@/apiLink"; // Update path if needed
import { useAuth } from "@/context/AuthContext"; // Assumes you have user context

// Dynamically import ApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  // const [isOpen, setIsOpen] = useState(false);
  const [monthlyHours, setMonthlyHours] = useState<number[]>(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const { authData } = useAuth(); // Assumes user object with userId is available

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: "Learning Hours",
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val} hrs`,
      },
    },
  };

  const series = [
    {
      name: "Learning Hours",
      data: monthlyHours,
    },
  ];


  useEffect(() => {
    const fetchMonthlyHours = async () => {
      try {
        const response = await fetch(api+"users/get-monthly-training-hours", {
          method:"POST",
          headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: authData?.user._id }),
        });

        if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

        setMonthlyHours(data.monthlyHours || Array(12).fill(0));
      } catch (error) {
        console.error("Error fetching training data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authData?.user._id) {
      fetchMonthlyHours();
    }
  }, [authData]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Learning Hours
        </h3>

        {/* <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div> */}
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {loading ? (
            <div className="text-gray-500 dark:text-gray-400 p-6">Loading...</div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={180}
            />
          )}
        </div>
      </div>
    </div>
  );
}
