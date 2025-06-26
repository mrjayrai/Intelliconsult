import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/MEcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MMonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MMonthlysalesChart";
// import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/MRecentOrders";
// import DemographicCard from "@/components/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title:
    "IntelliConsult",
  description: "This is IntelliConsult Dashboard",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

      <div className="col-span-12 ">
        <RecentOrders />
      </div>
    </div>
  );
}
