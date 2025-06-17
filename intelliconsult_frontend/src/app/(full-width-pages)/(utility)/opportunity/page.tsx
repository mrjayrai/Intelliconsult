import { Metadata } from "next";
import OpportunityPage  from "@/components/opportunity/OpportunityPage";
export const metadata: Metadata = {
  title: "IntelliConsult",
  description: "This is intelliConsult Skill Page",
};

export default function Skill() {
  return <OpportunityPage />;
}
