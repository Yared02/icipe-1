import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  HandCoins,
  GraduationCap,
  Smartphone,
  BookUser,
} from "lucide-react";
import { DemographyForm } from "./demography-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { EmploymentForm } from "./employment-form";
import { FinanceForm } from "./finance-form";
import { GeographyForm } from "./geography-form";
import { TechnologyForm } from "./technology-form";
import { HealthForm } from "./health-form";
import { BusinessInfoForm } from "@/components/business-info-form";
import { ShfInfoForm } from "./shf-info-form";
import { createClient } from "@/utils/supabase/server";
import { TableGrants } from "./table-grants";
import { TableDevices } from "./table-devices";
import { BackButton } from "@/components/back-button";
import { NumberCard } from "@/components/number-card";
import { TableCapDevs } from "./table-capdevs";

export default async function ParticipantPage({
  params,
  searchParams,
}: {
  params: { id: string; participantid: string };
  searchParams?: { grants?: string; devices?: string; capDevs?: string };
}) {
  const supabase = createClient();

  const { data: participantCapDevsData } = await supabase
    .from("participant_capdevs")
    .select("count()")
    .eq("participant_id", params.participantid);
  // @ts-ignore
  const participantCapDevsCount = participantCapDevsData?.at(0)?.count ?? 0;

  const { data: participantDevicesQuery } = await supabase
    .from("participant_devices")
    .select("count()")
    .eq("participant_id", params.participantid);
  // @ts-ignore
  const participantDevicesCount = participantDevicesQuery?.at(0)?.count ?? 0;

  const participantGrants = await supabase
    .from("participant_grants")
    .select(`*, grants:grant_id(*)`)
    .eq("participant_id", params.participantid);

  const participantDevices = await supabase
    .from("participant_devices")
    .select(`*, devices:device_id(*)`)
    .eq("participant_id", params.participantid);

  const participantCapDevs = await supabase
    .from("participant_capdevs")
    .select(`*, capdevs:capacity_development_id(*)`)
    .eq("participant_id", params.participantid);

  const businessQuery = await supabase
    .from("businesses")
    .select(
      "id,name,sector,level,establishment_year,female_employees,male_employees,source_of_capital,annual_income,annual_profit,current_capital,starting_capital,association_type,enterprise_activities,secondary_responsible_individual,daily_sales,weekly_sales,monthly_sales,estimated_customers,address,business_license,latitude,longitude,participant_id,unique_identifier,subpartner_names,number_of_youth,number_of_refugee_youth,number_of_idp_youth,number_of_plwd_youth,phone1,phone2,phone3,email,country"
    )
    .eq("participant_id", params.participantid);

  const grants: Database["public"]["Tables"]["grants"]["Row"][] =
    participantGrants.data?.map((row: any) => row.grants) ?? [];

  const devices: Database["public"]["Tables"]["devices"]["Row"][] =
    participantDevices.data?.map((row: any) => row.devices) ?? [];

  const capdevs: Database["public"]["Tables"]["capacity_developments"]["Row"][] =
    participantCapDevs.data?.map((row: any) => row.capdevs) ?? [];

  // Participant grants sum
  const grantsSum =
    participantGrants?.data?.reduce((acc, grant) => {
      return acc + grant.amount;
    }, 0) ?? 0;

  return (
    <div className="py-4">
      <div className="flex items-center px-4">
        <BackButton />
        <h1 className="text-xl font-bold">Participant</h1>
      </div>

      <div className="mx-auto container ">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 my-4">
          <NumberCard
            title="Grants"
            value={`ETB ${new Intl.NumberFormat().format(grantsSum)}`}
            icon={HandCoins}
          />
          <NumberCard
            title="CapDev"
            value={participantCapDevsCount.toString()}
            icon={GraduationCap}
          />
          {/* <NumberCard
            title="Assets"
            value={participantDevicesCount.toString()}
            icon={Smartphone}
          /> */}
        </div>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">
              <BookUser className="w-4 h-4 mr-1" />
              Details
            </TabsTrigger>
            <TabsTrigger value="business">
              <BriefcaseBusiness className="w-4 h-4 mr-1" />
              Businesses
            </TabsTrigger>
            {/* <TabsTrigger value="grants">
              <HandCoins className="w-4 h-4 mr-1" />
              Grants
            </TabsTrigger>
            <TabsTrigger value="devices">
              <Smartphone className="w-4 h-4 mr-1" />
              Assets
            </TabsTrigger> */}
            <TabsTrigger value="capacity_development">
              <GraduationCap className="w-4 h-4 mr-1" />
              CapDev
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Collapsible defaultOpen={true}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CaretSortIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                    Demography
                  </CardTitle>
                  <CardDescription>
                    Make changes to demography here. Click save when you're
                    done.
                  </CardDescription>
                </CardHeader>
                <CollapsibleContent>
                  <DemographyForm id={params.participantid} />
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible defaultOpen={false}>
              <Card className="mt-5">
                <CardHeader>
                  <CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CaretSortIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                    Employment
                  </CardTitle>
                  <CardDescription>
                    Make changes to employment details here. Click save when
                    you're done.
                  </CardDescription>
                </CardHeader>
                <CollapsibleContent>
                  <EmploymentForm id={params.participantid} />
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible defaultOpen={false}>
              <Card className="mt-5">
                <CardHeader>
                  <CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CaretSortIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                    Finance
                  </CardTitle>
                  <CardDescription>
                    Make changes to finance details here. Click save when you're
                    done.
                  </CardDescription>
                </CardHeader>
                <CollapsibleContent>
                  <FinanceForm id={params.participantid} />
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible defaultOpen={false}>
              <Card className="mt-5">
                <CardHeader>
                  <CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CaretSortIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                    Geography
                  </CardTitle>
                  <CardDescription>
                    Make changes to geography details here. Click save when
                    you're done.
                  </CardDescription>
                </CardHeader>
                <CollapsibleContent>
                  <GeographyForm id={params.participantid} />
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible defaultOpen={false}>
              <Card className="mt-5">
                <CardHeader>
                  <CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CaretSortIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                    Technology
                  </CardTitle>
                  <CardDescription>
                    Make changes to technology details here. Click save when
                    you're done.
                  </CardDescription>
                </CardHeader>
                <CollapsibleContent>
                  <TechnologyForm id={params.participantid} />
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible defaultOpen={false}>
              <Card className="mt-5">
                <CardHeader>
                  <CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CaretSortIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                    Health
                  </CardTitle>
                  <CardDescription>
                    Make changes to health details here. Click save when you're
                    done.
                  </CardDescription>
                </CardHeader>
                <CollapsibleContent>
                  <HealthForm id={params.participantid} />
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </TabsContent>
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Businesses</CardTitle>
                <CardDescription>
                  Add or remove businesses from your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessInfoForm
                  programId={params.id}
                  participantId={parseInt(params.participantid)}
                  business={
                    businessQuery?.data?.at(
                      0
                    ) as Database["public"]["Tables"]["businesses"]["Row"]
                  }
                />
              </CardContent>
            </Card>

            <Collapsible defaultOpen={false}>
              <Card className="mt-5">
                <CardHeader>
                  <CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CaretSortIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                    SHF
                  </CardTitle>
                  <CardDescription>
                    Make changes to SHF details here. Click save when you're
                    done.
                  </CardDescription>
                </CardHeader>
                {/* <CollapsibleContent>
                  <ShfInfoForm
                    programId={params.id}
                    participantid={params.participantid}
                  />
                </CollapsibleContent> */}
              </Card>
            </Collapsible>
          </TabsContent>
          <TabsContent value="grants">
            <div className="my-4">
              <TableGrants participantId={params.participantid} data={grants} />
            </div>
          </TabsContent>
          <TabsContent value="devices">
            <div className="my-4">
              <TableDevices
                participantId={params.participantid}
                data={devices}
              />
            </div>
          </TabsContent>
          <TabsContent value="capacity_development">
            <div className="my-4">
              <TableCapDevs
                data={capdevs}
                programId={params.id}
                participantId={params.participantid}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
