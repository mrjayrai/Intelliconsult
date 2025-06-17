import { Metadata } from "next";
import TrainingPage  from "@/components/training/TrainingPage";
export const metadata: Metadata = {
  title: "IntelliConsult",
  description: "This is intelliConsult Training Page",
};

export default function Training() {
  return <TrainingPage />;
}
