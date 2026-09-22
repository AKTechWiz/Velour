import type { Metadata } from "next";
import LoginPage from "@/components/LoginPage";

export const metadata: Metadata = { title: "Account" };

export default function Page() {
  return <LoginPage />;
}
