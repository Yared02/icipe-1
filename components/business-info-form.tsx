"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { GoogleMap } from "./google-maps";

export const updateSchema = z.object({
  name: z.string(),
  sector: z.string().optional(),
  crop: z.string().optional(),

  level: z.string().optional(),
  establishment_year: z.string().optional(),
  female_employees: z.string().optional(),
  male_employees: z.string().optional(),
  source_of_capital: z.string().optional(),
  annual_income: z.string().optional(),
  annual_profit: z.string().optional(),
  current_capital: z.string().optional(),
  starting_capital: z.string().optional(),
  association_type: z.string().optional(),
  enterprise_activities: z.string().optional(),
  secondary_responsible_individual: z.string().optional(),
  daily_sales: z.string().optional(),
  weekly_sales: z.string().optional(),
  monthly_sales: z.string().optional(),
  estimated_customers: z.string().optional(),
  address: z.string().optional(),
  unique_identifier: z.string().optional(),
  subpartner_names: z.string().optional(),
  number_of_youth: z.number().optional(),
  number_of_refugee_youth: z.number().optional(),
  number_of_idp_youth: z.number().optional(),
  number_of_plwd_youth: z.number().optional(),
  phone1: z.string().optional(),
  phone2: z.string().optional(),
  phone3: z.string().optional(),
  email: z.string().optional(),
  country: z.string().optional(),
});

export type UpdateBusinessInfo = z.infer<typeof updateSchema>;

export function BusinessInfoForm({
  participantId,
  programId,
  business,
}: {
  business: Database["public"]["Tables"]["businesses"]["Row"] | undefined;
  participantId?: number;
  programId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number }>();



    const [selectedSector, setSelectedSector] = useState("");

    const handleSectorChange = (value: string) => {
      setSelectedSector(value);
    form.setValue('sector', value); // Update form state
  };

  const form = useForm<UpdateBusinessInfo>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: business?.name ?? "",
      sector: business?.sector ?? "",
      level: business?.level ?? "",
      establishment_year: business?.establishment_year?.toString() ?? "",
      female_employees: business?.female_employees?.toString() ?? "",
      male_employees: business?.male_employees?.toString() ?? "",
      source_of_capital: business?.source_of_capital ?? "",
      annual_income: business?.annual_income?.toString() ?? "",
      annual_profit: business?.annual_profit?.toString() ?? "",
      current_capital: business?.current_capital?.toString() ?? "",
      starting_capital: business?.starting_capital?.toString() ?? "",
      association_type: business?.association_type ?? "",
      enterprise_activities: business?.enterprise_activities ?? "",
      secondary_responsible_individual:
        business?.secondary_responsible_individual ?? "",
      daily_sales: business?.daily_sales?.toString() ?? "",
      weekly_sales: business?.weekly_sales?.toString() ?? "",
      monthly_sales: business?.monthly_sales?.toString() ?? "",
      estimated_customers: business?.estimated_customers?.toString() ?? "",
      address: business?.address ?? "",
      unique_identifier: business?.unique_identifier ?? "",
      subpartner_names: business?.subpartner_names ?? "",
      number_of_youth: business?.number_of_youth ?? 0,
      number_of_refugee_youth: business?.number_of_refugee_youth ?? 0,
      number_of_idp_youth: business?.number_of_idp_youth ?? 0,
      number_of_plwd_youth: business?.number_of_plwd_youth ?? 0,
      phone1: business?.phone1 ?? "",
      phone2: business?.phone2 ?? "",
      phone3: business?.phone3 ?? "",
      email: business?.email ?? "",
      country: business?.country ?? "",
    },
  });

  useEffect(() => {
    if (business?.latitude && business.longitude) {
      setLatLng({
        lat: business.latitude,
        lng: business.longitude,
      });
    }
  }, [business?.latitude, business?.longitude]);

  const update = async (update: UpdateBusinessInfo) => {
    if (!participantId && !business?.participant_id) {
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const insert: Database["public"]["Tables"]["businesses"]["Insert"] = {
      ...update,
      program_id: parseInt(programId),
      participant_id: business?.participant_id
        ? business.participant_id
        : (participantId as number),
      establishment_year: update.establishment_year
        ? parseInt(update.establishment_year)
        : undefined,
      female_employees: update.female_employees
        ? parseInt(update.female_employees)
        : undefined,
      male_employees: update.male_employees
        ? parseInt(update.male_employees)
        : undefined,
      annual_income: update.annual_income
        ? parseInt(update.annual_income)
        : undefined,
      annual_profit: update.annual_profit
        ? parseInt(update.annual_profit)
        : undefined,
      current_capital: update.current_capital
        ? parseInt(update.current_capital)
        : undefined,
      starting_capital: update.starting_capital
        ? parseInt(update.starting_capital)
        : undefined,
      daily_sales: update.daily_sales
        ? parseInt(update.daily_sales)
        : undefined,
      weekly_sales: update.weekly_sales
        ? parseInt(update.weekly_sales)
        : undefined,
      monthly_sales: update.monthly_sales
        ? parseInt(update.monthly_sales)
        : undefined,
      estimated_customers: update.estimated_customers
        ? parseInt(update.estimated_customers)
        : undefined,
      latitude: latLng?.lat ? latLng.lat : undefined,
      longitude: latLng?.lng ? latLng.lng : undefined,
    };

    console.log("Insert", insert);

    if (business?.id) {
      insert.id = business.id;
    }

    const { error } = await supabase.from("businesses").upsert(insert);

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    toast.success("Business updated successfully");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(update)}>
        <div className="grid grid-cols-12 gap-4 px-6">
          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="unique_identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unique Identifier</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Unique Identifier"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
          <FormField
        control={form.control}
        name="sector"
        render={({ field }) => (
          <FormItem>
            <Label htmlFor="sector">Sector</Label>
            <FormControl>
              <Select
                {...field}
                onValueChange={handleSectorChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Domestic and Trade Service">Domestic and Trade Service</SelectItem>
                  <SelectItem value="Retailers">Retailers</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

{selectedSector === "Agriculture" && (
        <FormField
          control={form.control}
          name="crop"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="crop">Crop</Label>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a crop" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="BeeKeeping">Bee Keeping</SelectItem>

                    <SelectItem value="Carrot">Carrot</SelectItem>
                    <SelectItem value="Green Paper">Green Paper</SelectItem>
                    <SelectItem value="Potato">Potato</SelectItem>
                    <SelectItem value="Tomato">Tomato</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      )}

          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="level">Level</Label>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Startup">Startup</SelectItem>
                        <SelectItem value="Growing">Growing</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="subpartner_names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Sup-Partners</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Name of Sup-Partners"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="establishment_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Establishment Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Establishment Year"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="female_employees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Female Employees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Female Employees"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="male_employees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Male Employees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Male Employees"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="number_of_youth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Youth</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of Youth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="number_of_refugee_youth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Youth Who Are Regugees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of Youth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="number_of_idp_youth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Youth Who Are IDP</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of Youth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="number_of_plwd_youth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Youth Who Are PLWDs</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of Youth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="source_of_capital"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="source_of_capital">Source of Capital</Label>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Source of Capital" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Loan">Loan</SelectItem>
                        <SelectItem value="Fund">Fund</SelectItem>
                        <SelectItem value="Familiy">Familiy</SelectItem>
                        <SelectItem value="Own">Own</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="annual_income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Income</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Annual Income"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="annual_profit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Profit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Annual Profit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="current_capital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Capital</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Current Capital"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="starting_capital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Capital</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Starting Capital"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="association_type"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="association_type">Association Type</Label>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Association Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Sole">Sole</SelectItem>
                        <SelectItem value="PLC">PLC</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="enterprise_activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enterprise Activities</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enterprise Activities"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="secondary_responsible_individual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Second Responsible Individual</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Second Responsible Individual"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="daily_sales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Sales</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Daily Sales" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="weekly_sales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weekly Sales</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Weekly Sales"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="monthly_sales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Sales</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Monthly Sales"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="estimated_customers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Customer</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Estimated Customer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="my-5">
          <Separator />
        </div>

        <div className="grid grid-cols-12 gap-4 px-6">
          <div className="col-span-12">
            <h3 className="text-lg font-bold">Contact</h3>
          </div>

          <div className="grid grid-cols-12 gap-4 col-span-12">
            <div className="space-y-1 col-span-4">
              <FormField
                control={form.control}
                name="phone1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone 1</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Phone 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1 col-span-4">
              <FormField
                control={form.control}
                name="phone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone 2</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Phone 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1 col-span-4">
              <FormField
                control={form.control}
                name="phone3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone 3</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Phone 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="my-5">
          <Separator />
        </div>

        <div className="grid grid-cols-12 gap-4 px-6">
          <div className="col-span-12">
            <h3 className="text-lg font-bold">Location</h3>
          </div>

          <div className="space-y-1 col-span-12">
            <div className="rounded-lg shadow-lg">
              <GoogleMap latLng={latLng} setLatLng={setLatLng} />
            </div>
            {latLng && (
              <div className="mt-4">
                <div>
                  <span className="font-semibold">Latitude:</span> {latLng.lat}
                </div>
                <div>
                  <span className="font-semibold">Longitude:</span> {latLng.lng}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end justify-end px-6 py-4">
          <Button disabled={isLoading} type="submit">
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
