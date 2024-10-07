import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export function NumberCard(params: {
  title: string;
  value: string;
  percentage?: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{params.title}</CardTitle>
        <params.icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{params.value}</div>
        {params.percentage && (
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
