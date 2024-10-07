import { createClient } from "@/utils/supabase/server";
import { BusinessInfoForm } from "@/components/business-info-form";
import { BackButton } from "@/components/back-button";
import { Separator } from "@/components/ui/separator";

export default async function BusinessPage({
  params,
}: {
  params: { id: string; businessid: string };
}) {
  const supabase = createClient();

  const { data } = await supabase
    .from("businesses")
    .select(
      "id,name,sector,level,establishment_year,female_employees,male_employees,source_of_capital,annual_income,annual_profit,current_capital,starting_capital,association_type,enterprise_activities,secondary_responsible_individual,daily_sales,weekly_sales,monthly_sales,estimated_customers,address,business_license,latitude,longitude,participant_id"
    )
    .eq("id", params.businessid)
    .eq("program_id", params.id);

  return (
    <div>
      <div className="flex items-center px-4 py-[8px]">
        <BackButton />
        <h1 className="text-xl font-bold">Business</h1>
      </div>
      <Separator />

      <div className="mx-auto container py-4">
        <BusinessInfoForm
          programId={params.id}
          business={
            data?.at(0) as Database["public"]["Tables"]["businesses"]["Row"]
          }
        />
      </div>
    </div>
  );
}
