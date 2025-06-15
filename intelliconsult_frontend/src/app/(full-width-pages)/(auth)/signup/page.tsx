import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IntelliConsult",
  description: "This is IntelliConsult SignUp Page",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
