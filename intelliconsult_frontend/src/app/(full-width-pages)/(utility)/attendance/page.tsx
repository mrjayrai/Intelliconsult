import { Metadata } from "next";
import AttendancePage  from "@/components/attendance/AttendancePage";
export const metadata: Metadata = {
  title: "IntelliConsult",
  description: "This is intelliConsult Skill Page",
};

export default function Skill() {
  return <AttendancePage />;
}
