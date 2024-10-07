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
import {
  CreateCapacityDevelopment,
  createCapacityDevelopmentSchema,
} from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

export function CreateCapacityDevelopmentForm({
  programId,
  onSuccess,
}: {
  programId: string;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateCapacityDevelopment>({
    resolver: zodResolver(createCapacityDevelopmentSchema),
  });

  const create = async (
    createCapacityDevelopment: CreateCapacityDevelopment
  ) => {
    setIsLoading(true);

    const supabase = createClient();
    const userId=localStorage.getItem('id')
    const organization=localStorage.getItem('organization')


    const { error } = await supabase.from("capacity_developments").insert({
      ...createCapacityDevelopment,
      total_participant_capacity: parseInt(
        createCapacityDevelopment.total_participant_capacity ?? "0"
      ),
      created_by:userId,
      program_id: 3,
      organization:organization
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    onSuccess();
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={form.handleSubmit(create)}
      >
        <div className="space-y-1 col-span-12">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-1 col-span-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="type">Type</Label>
                <FormControl>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Informal">Informal</SelectItem>
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
            name="total_participant_capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participant Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Participant Capacity"
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
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="From" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-1 col-span-6">
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="To" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-1 col-span-12">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="status">Status</Label>
                <FormControl>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 flex items-end justify-end">
          <Button disabled={isLoading} type="submit">
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
