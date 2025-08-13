import { GraduationCap } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <GraduationCap className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold font-headline">CareerWise AI</span>
    </Link>
  );
}
