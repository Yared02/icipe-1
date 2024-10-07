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
import { Switch } from "@/components/ui/switch";

export const updateSchema = z.object({
  health_pre_existing_conditions: z.string(),
  health_disability: z.string(),
  is_idp: z.boolean(),
  is_refugee: z.boolean(),
});

export type UpdateHealth = z.infer<typeof updateSchema>;

export function HealthForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UpdateHealth>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    const getData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("participants")
        .select(
          "health_pre_existing_conditions,health_disability,is_idp,is_refugee"
        )
        .eq("id", id);

      const participant = data?.at(0);
      if (!participant) return;

      form.reset({
        health_pre_existing_conditions:
          participant.health_pre_existing_conditions ?? "",
        health_disability: participant.health_disability ?? "",
        is_idp: participant.is_idp ?? false,
        is_refugee: participant.is_refugee ?? false,
      });
    };

    getData();
  }, []);

  const update = async (update: UpdateHealth) => {
    setIsLoading(true);

    const supabase = createClient();

    const participant: Database["public"]["Tables"]["participants"]["Update"] =
      {
        ...update,
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
          <div className="space-y-1 col-span-6">
            <FormField
              control={form.control}
              name="health_pre_existing_conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pre-Existing Conditions</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Pre-Existing Conditions"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-6">
            <FormField
              control={form.control}
              name="health_disability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health Disability</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Health Disability"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-6">
            <FormField
              control={form.control}
              name="is_idp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>IDP</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-6">
            <FormField
              control={form.control}
              name="is_refugee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Refugee</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
