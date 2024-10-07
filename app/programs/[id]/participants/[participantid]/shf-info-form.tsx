"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const updateSchema = z.object({
  hectars_under_cultivation: z.string().optional(),
  land_tenure_status: z.string().optional(),
  farming_experience: z.string().optional(),
  farming_method: z.string().optional(),
  crop_annual_yield: z.string().optional(),
  crop_rotation_frequency: z.string().optional(),
  crop_rotation_type: z.string().optional(),
  crop_verity: z.string().optional(),
  crop_season_timing: z.string().optional(),
  crop_season_duration: z.string().optional(),
  crop_harvesting_method: z.string().optional(),
  irrigration_availability: z.string().optional(),
  rainfall_dependecy: z.string().optional(),
  number_of_livestock: z.string().optional(),
  type_of_livestock: z.string().optional(),
});

export type UpdateShfInfo = z.infer<typeof updateSchema>;

export function ShfInfoForm({
  programId,
  participantid,
}: {
  programId: string;
  participantid: string;
}) {
  const [id, setId] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UpdateShfInfo>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    const getData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("businesses")
        .select(
          "id,hectars_under_cultivation,land_tenure_status,farming_experience,farming_method,crop_annual_yield,crop_rotation_frequency,crop_rotation_type,crop_verity,crop_season_timing,crop_season_duration,crop_harvesting_method,irrigration_availability,rainfall_dependecy,number_of_livestock,type_of_livestock"
        )
        .eq("participant_id", participantid);

      const business = data?.at(0);
      if (!business) return;

      setId(business.id);

      form.reset({
        hectars_under_cultivation:
          business.hectars_under_cultivation?.toString() ?? "",
        land_tenure_status: business.land_tenure_status ?? "",
        farming_experience: business.farming_experience?.toString() ?? "",
        farming_method: business.farming_method ?? "",
        crop_annual_yield: business.crop_annual_yield?.toString() ?? "",
        crop_rotation_frequency: business.crop_rotation_frequency ?? "",
        crop_rotation_type: business.crop_rotation_type ?? "",
        crop_verity: business.crop_verity ?? "",
        crop_season_timing: business.crop_season_timing ?? "",
        crop_season_duration: business.crop_season_duration ?? "",
        crop_harvesting_method: business.crop_harvesting_method ?? "",
        irrigration_availability: business.irrigration_availability ?? "",
        rainfall_dependecy: business.rainfall_dependecy ?? "",
        number_of_livestock: business.number_of_livestock?.toString() ?? "",
        type_of_livestock: business.type_of_livestock ?? "",
      });
    };

    getData();
  }, []);

  const update = async (update: UpdateShfInfo) => {
    setIsLoading(true);

    const supabase = createClient();

    const business: Database["public"]["Tables"]["businesses"]["Update"] = {
      ...update,
      program_id: parseInt(programId),
      participant_id: parseInt(participantid),
      hectars_under_cultivation: update.hectars_under_cultivation
        ? parseInt(update.hectars_under_cultivation)
        : undefined,
      farming_experience: update.farming_experience
        ? parseInt(update.farming_experience)
        : undefined,
      crop_annual_yield: update.crop_annual_yield
        ? parseInt(update.crop_annual_yield)
        : undefined,
      number_of_livestock: update.number_of_livestock
        ? parseInt(update.number_of_livestock)
        : undefined,
    };

    if (id) {
      business.id = id;
    }

    const { error } = await supabase.from("businesses").update(business);

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
              name="hectars_under_cultivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hectars under cultivation</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Hectars under cultivation"
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
              name="land_tenure_status"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="land_tenure_status">Land Tenure Status</Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Land Tenure Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ownership">Ownership</SelectItem>
                        <SelectItem value="Lease">Lease</SelectItem>
                        <SelectItem value="Communal">Communal</SelectItem>
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
              name="farming_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farming Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Farming Experience"
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
              name="farming_method"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="farming_method">Farming Method</Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Farming Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Traditional">Traditional</SelectItem>
                        <SelectItem value="Organic">Organic</SelectItem>
                        <SelectItem value="Modern Techniques">
                          Modern Techniques
                        </SelectItem>
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
              name="crop_annual_yield"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Annual Yield</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Crop Annual Yield"
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
              name="crop_rotation_frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Rotation Frequency</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Crop Rotation Frequency"
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
              name="crop_rotation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Rotation Type</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Crop Rotation Type"
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
              name="crop_verity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Verity</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Crop Verity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="crop_season_timing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop season timing</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Crop season timing"
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
              name="crop_season_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop season duration</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Crop season duration"
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
              name="crop_harvesting_method"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="crop_harvesting_method">
                    Harvesting Method
                  </Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Harvesting Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Mechanized">Mechanized</SelectItem>
                        <SelectItem value="Combined">Combined</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
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
