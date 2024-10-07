"use client";

import { Input } from "@/components/ui/input";
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
import { GoogleMap } from "@/components/google-maps";

export const updateSchema = z.object({
  region: z.string(),
  woreda: z.string(),
  zone: z.string(),
  kebele: z.string(),
  subcity: z.string(),
});

export type UpdateGeography = z.infer<typeof updateSchema>;

export function GeographyForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number }>();

  const form = useForm<UpdateGeography>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    const getData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("participants")
        .select("region,woreda,zone,kebele,subcity,latitude,longitude")
        .eq("id", id);

      const participant = data?.at(0);
      if (!participant) return;

      form.reset({
        region: participant.region ?? "",
        woreda: participant.woreda ?? "",
        zone: participant.zone ?? "",
        kebele: participant.kebele ?? "",
        subcity: participant.subcity ?? "",
      });

      if(participant.latitude && participant.longitude) {
        setLatLng({
          lat: participant.latitude,
          lng: participant.longitude,
        });
      }
    };

    getData();
  }, []);

  const update = async (update: UpdateGeography) => {
    setIsLoading(true);

    const supabase = createClient();

    const participant: Database["public"]["Tables"]["participants"]["Update"] =
      {
        ...update,
        latitude: latLng?.lat ? latLng.lat : undefined,
        longitude: latLng?.lng ? latLng.lng : undefined,
      };

    const { error } = await supabase
      .from("participants")
      .update(participant)
      .eq("id", id);

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    toast.success("Participant updated successfully");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(update)}>
        <div className="grid grid-cols-12 gap-4 px-6">
          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="Region" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="woreda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Woreda</FormLabel>
                  <FormControl>
                    <Input placeholder="Woreda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <FormControl>
                    <Input placeholder="Zone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="kebele"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kebele</FormLabel>
                  <FormControl>
                    <Input placeholder="Kebele" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="subcity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcity</FormLabel>
                  <FormControl>
                    <Input placeholder="Subcity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
