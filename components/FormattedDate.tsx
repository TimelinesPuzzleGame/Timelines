// components/FormattedDate.tsx
import React from "react";
import { formatDate } from "../lib/dateUtils";

interface FormattedDateProps {
  date: number;
}

export default function FormattedDate({ date }: FormattedDateProps) {
  const label = formatDate(date);
  // Split on the first space: mainPart = "432" or "~4.5B", suffix = "B.C.E." or "yrs ago"
  const match = label.match(/^(.+?)\s+(.+)$/);
  const mainPart = match ? match[1] : label;
  const suffix   = match ? match[2] : "";

  return (
    <span className="inline-block">
      {/* number+unit stays at parent font-size */}
      <span>{mainPart}</span>
      {/* suffix (e.g. "yrs ago" or "B.C.E.") on its own line, larger */}
      {suffix && <span className="block text-lg">{suffix}</span>}
    </span>
  );
}
