import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelliconsult-SignIn",
  description: "Intelliconsult-SignIn Page",
};

export default function Sign() {
 redirect("/signin");
}