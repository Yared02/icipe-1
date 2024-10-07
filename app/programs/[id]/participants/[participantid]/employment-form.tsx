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
import { Switch } from "@/components/ui/switch";

export const updateSchema = z.object({
  employment_status: z.string(),
  employment_type: z.string(),
  employment_duration: z.string(),
  is_student: z.boolean(),
});

export type UpdateEmployment = z.infer<typeof updateSchema>;

export function EmploymentForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UpdateEmployment>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    const getData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("participants")
        .select(
          "employment_status,employment_type,employment_duration,is_student"
        )
        .eq("id", id);

      const participant = data?.at(0);
      if (!participant) return;

      form.reset({
        employment_status: participant.employment_status ?? "",
        employment_type: participant.employment_type ?? "",
        employment_duration: participant.employment_duration ?? "",
        is_student: participant.is_student ?? false,
      });
    };

    getData();
  }, []);

  const update = async (update: UpdateEmployment) => {
    setIsLoading(true);

    const supabase = createClient();

    const participant: Database["public"]["Tables"]["participants"]["Update"] =
      {
        ...update,
        is_student: update.is_student ?? false,
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
              name="employment_status"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="status">Status</Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employed">Employed</SelectItem>
                        <SelectItem value="Unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-6">
            <FormField
              control={form.control}
              name="employment_type"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="status">Type</Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="fulltime">Fulltime</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-6">
            <FormField
              control={form.control}
              name="employment_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration of Employment</FormLabel>
                  <FormControl>
                    <Input placeholder="Employment of Duration" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-6">
            <FormLabel>Student</FormLabel>

            <FormField
              control={form.control}
              name="is_student"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border px-3 py-1 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Student</FormLabel>
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
