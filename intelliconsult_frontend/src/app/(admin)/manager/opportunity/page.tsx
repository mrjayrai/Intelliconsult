import { Metadata } from "next";
// import OpportunityPage  from "@/components/opportunity/OpportunityPage";
import OpportunityPage_Manager from "@/components/opportunity/OpportunityPage_Manager";
export const metadata: Metadata = {
  title: "IntelliConsult",
  description: "This is intelliConsult Skill Page",
};

export default function Skill() {
  return <OpportunityPage_Manager />;
}
