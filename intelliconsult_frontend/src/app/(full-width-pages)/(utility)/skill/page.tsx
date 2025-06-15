import { Metadata } from "next";
import SkillsPage  from "@/components/skill/SkillsPage";
export const metadata: Metadata = {
  title: "IntelliConsult",
  description: "This is intelliConsult Skill Page",
};

export default function Skill() {
  return <SkillsPage />;
}
