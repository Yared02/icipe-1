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
  monthly_expense: z.string(),
  income_level: z.string(),
  saving_account_availability: z.string(),
});

export type UpdateFinance = z.infer<typeof updateSchema>;

export function FinanceForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UpdateFinance>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    const getData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("participants")
        .select("monthly_expense,income_level,saving_account_availability")
        .eq("id", id);

      const participant = data?.at(0);
      if (!participant) return;

      form.reset({
        monthly_expense: participant.monthly_expense?.toString() ?? "",
        income_level: participant.income_level ?? "",
        saving_account_availability:
          participant.saving_account_availability ?? "",
      });
    };

    getData();
  }, []);

  const update = async (update: UpdateFinance) => {
    setIsLoading(true);

    const supabase = createClient();

    const participant: Database["public"]["Tables"]["participants"]["Update"] =
      {
        ...update,
        monthly_expense: parseInt(update.monthly_expense),
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
              name="monthly_expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Expense</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Monthly Expense" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="income_level"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="income_level">Income Level</Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Income Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="high">High</SelectItem>
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
              name="saving_account_availability"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="saving_account_availability">
                    Saving Account Availability
                  </Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Saving Account Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="at_banks">At banks</SelectItem>
                        <SelectItem value="mfi">MFI</SelectItem>
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
