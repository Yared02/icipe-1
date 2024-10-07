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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@radix-ui/react-select";
import { SelectValue } from "@/components/ui/select";

export const updateSchema = z.object({
  uses_atm: z.boolean(),
  uses_mobile_banking: z.boolean(),
  uses_internet: z.boolean(),
  uses_social_media: z.boolean(),
  monthly_mobile_card_expense: z.string(),
  rate: z.string(),

});

export type UpdateTechnology = z.infer<typeof updateSchema>;

export function TechnologyForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UpdateTechnology>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    const getData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("participants")
        .select(
          "uses_atm,uses_mobile_banking,uses_internet,uses_social_media,monthly_mobile_card_expense"
        )
        .eq("id", id);

      const participant = data?.at(0);
      if (!participant) return;

      form.reset({
        uses_atm: participant.uses_atm ?? undefined,
        uses_mobile_banking: participant.uses_mobile_banking ?? undefined,
        uses_internet: participant.uses_internet ?? undefined,
        uses_social_media: participant.uses_social_media ?? undefined,
        monthly_mobile_card_expense:
          participant.monthly_mobile_card_expense?.toString() ?? undefined,
      });
    };

    getData();
  }, []);

  const update = async (update: UpdateTechnology) => {
    setIsLoading(true);

    const supabase = createClient();

    const participant: Database["public"]["Tables"]["participants"]["Update"] =
      {
        ...update,
        monthly_mobile_card_expense: parseInt(
          update.monthly_mobile_card_expense
        ),
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
  const [selectedSector, setSelectedSector] = useState("");




  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(update)}>
        <div className="grid grid-cols-12 gap-4 px-6">
          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="uses_atm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Uses ATM</FormLabel>
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

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="uses_mobile_banking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Uses Mobile Banking</FormLabel>
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

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="uses_internet"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Uses Internet</FormLabel>
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

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="uses_social_media"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Uses Social Media</FormLabel>
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


          
     {/* Rate Technology Usage Dropdown */}
     <div className="space-y-1 col-span-4">

     <FormField
  name="rate"
  render={({ field }) => (
    <div style={{ margin: '20px 0', fontFamily: 'Arial, sans-serif' }}>
      <label 
        htmlFor="rate" 
        style={{ 
          display: 'block', 
          marginBottom: '10px', 
          fontWeight: 'bold', 
          color: '#333' 
        }}
      >
        Rate Technology Usage
      </label>
      <select 
        {...field} 
        id="rate" 
        defaultValue="" 
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
          width: '100%',
          maxWidth: '300px',
          backgroundColor: '#f9f9f9',
          transition: 'border-color 0.3s',
        }}
        onFocus={(e) => e.target.style.borderColor = '#007BFF'}
        onBlur={(e) => e.target.style.borderColor = '#ccc'}
      >
        <option value="" disabled>
          {/* Rate Technology Usage */}
        </option>
        <option value="Poor">Poor</option>
        <option value="Very Poor">Very Poor</option>
        <option value="Good">Good</option>
        <option value="Very Good">Very Good</option>
      </select>
    </div>
  )}
/>
                </div>

          <div className="space-y-1 col-span-12">
            <FormField
              control={form.control}
              name="monthly_mobile_card_expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Mobile Card Expense</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Monthly Mobile Card Expense"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
