import React from "react";
import ConsultantInsights from "@/components/insight/ConsultantInsights";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IntelliConsult",
  description: "This is intelliConsult Skill Page",
};
export default function SummaryPage() {
  return <ConsultantInsights />;
}
