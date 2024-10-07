"use client"
import { useEffect, useState } from "react";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { RecentSales } from "@/components/recent-sales";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumberCard } from "@/components/number-card";
import { GraduationCap, HandCoins, Users2,GroupIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { DashboardCluster } from "@/components/dashboard-cluster";
import { PieGender } from "@/components/pie-gender";
import { PieRegion } from "@/components/pie-region";
import { BarChart } from "@/components/bar-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface MonthAggregate {
  mon: string;
  sum: number;
}
interface Participant {
  id: string;
  firstname: string;
  surname: string;
  region: string;
  gender: string;
  created_by: string;
  created_at: string;
}


export default function ProgramPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [recentParticipants, setRecentParticipants] = useState<Participant[]>([]); // Specify type here
  const [recentGrants, setRecentGrants] = useState<any[]>([]);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [totalGrants, setTotalGrants] = useState<number>(0);
  const [disbursed, setDisbursed] = useState<number>(0);
  const [totalCapDev, setTotalCapDev] = useState<number>(0);
  const [monthAggregate, setMonthAggregate] = useState<MonthAggregate[]>([]);
  const [organization, setOrganization] = useState<string | null>(null);

  const [color, setColor] = useState<string>("");

  const supabase = createClient();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("id");
      const storedOrganization = localStorage.getItem("organization");
      
      setUserId(storedUserId);
      setOrganization(storedOrganization);
    }
  }, []);

  const regionColor = organization === "IIRR" ? "blue" : "green";
  const buttonColor = organization === "IIRR" ? "bg-blue-500 hover:bg-blue-700" : "bg-green-500 hover:bg-green-700";

  

  useEffect(() => {
    const fetchData = async () => {
      const { data: totalGrantsData } = await supabase
        .from("grants")
        .select("total_amount.sum()");
      const { data: disbursedData } = await supabase
        .from("participant_grants")
        .select("amount.sum()");
      const { data: totalParticipantsData } = await supabase
        .from("participants")
        .select("count()");
      const { data: totalCapDevData } = await supabase
        .from("participant_capdevs")
        .select("count()");
      const { data: monthAggregateData } = await supabase.rpc(
        "get_participan_grants_month_aggregate"
      );

      if (userId) {
        const { data: recentParticipantsData } = await supabase
          .from("participants")
          .select("*")
          .eq("created_by", userId)
          .order("created_at", { ascending: false })
          .limit(5);
        setRecentParticipants(recentParticipantsData ?? []);
      }

      const { data: recentGrantsData } = await supabase
        .from("grants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setTotalGrants(totalGrantsData?.[0]?.sum ?? 0);
      setDisbursed(disbursedData?.[0]?.sum ?? 0);
      setTotalParticipants(0);
      setTotalCapDev( 0);
      setRecentGrants(recentGrantsData ?? []);
      setMonthAggregate(
        monthAggregateData?.map((e: MonthAggregate) => ({
          name: e.mon,
          total: e.sum,
        })) ?? []
      );
    };

    fetchData();
  }, [userId]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button className={`${buttonColor} text-white py-2 px-4 rounded`}>
        Download CSV
      </Button>        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <NumberCard
              title="Participants"
              value={new Intl.NumberFormat().format(totalParticipants)}
              icon={Users2}
              percentage="+20.1% from last month"
            />
            <NumberCard
              title="CapDev Participants"
              value={new Intl.NumberFormat().format(totalCapDev)}
              icon={GraduationCap}
              percentage="+20.1% from last month"
            />
                <NumberCard
              title="Group"
              value={new Intl.NumberFormat().format(totalCapDev)}
              icon={GroupIcon}
              percentage="+20.1% from last month"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Participants</CardTitle>
                <CardDescription>
                See participants who have registered this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentParticipants.map((participant: any) => (
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>
                          {participant.firstname?.charAt(0)}
                          {participant.surname?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {participant.firstname} {participant.surname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {participant.region}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {participant.gender}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
           
                  <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <PieGender   color={regionColor} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Regions</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
              <PieRegion color={regionColor} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
