import { Metadata } from "next";
// import OpportunityPage  from "@/components/opportunity/OpportunityPage";
import TrainingPage_Manager from "@/components/training/TrainingPage_Manager";
export const metadata: Metadata = {
  title: "IntelliConsult",
  description: "This is intelliConsult Skill Page",
};

export default function Skill() {
  return <TrainingPage_Manager/>;
}
