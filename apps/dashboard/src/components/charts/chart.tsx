import { Counter } from "@/components/counter";
import { getMetrics } from "@midday/supabase/cached-queries";
import { cn } from "@midday/ui/utils";
import { cookies } from "next/headers";
import { FormatAmount } from "../format-amount";
import { BarChart } from "./bar-chart";
import { chartData } from "./data";

export async function Chart({ value, defaultValue, disabled }) {
  const type = cookies().get("chart-type")?.value ?? "profit";
  const data = disabled
    ? chartData
    : await getMetrics({ ...defaultValue, ...value, type });

  return (
    <div className="relative mt-32">
      <div className="absolute -top-[120px] space-y-2">
        <h1 className={cn("text-3xl", disabled && "skeleton-box")}>
          <Counter
            value={data.summary.currentTotal}
            currency={data.summary.currency}
          />
        </h1>
        <p className={cn("text-sm text-[#606060]", disabled && "skeleton-box")}>
          vs{" "}
          <FormatAmount
            maximumFractionDigits={0}
            minimumFractionDigits={0}
            amount={data.summary.prevTotal || 0}
            currency={data.summary.currency}
          />{" "}
          last period
        </p>
      </div>
      <BarChart data={data} disabled={disabled} />
    </div>
  );
}
