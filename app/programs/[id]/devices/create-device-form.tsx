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
import { CreateDevice, createDeviceSchema } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function CreateDeviceForm({
  programId,
  onSuccess,
}: {
  programId: string;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateDevice>({
    resolver: zodResolver(createDeviceSchema),
  });

  const create = async (createDevice: CreateDevice) => {
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.from("devices").insert({
      ...createDevice,
      amount: parseInt(createDevice.amount ?? "0"),
      program_id: parseInt(programId),
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
                      <SelectItem value="Smartphone">Smartphone</SelectItem>
                      <SelectItem value="Feature Phone">
                        Feature Phone
                      </SelectItem>
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number</FormLabel>
                <FormControl>
                  <Input placeholder="Number of Assets" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-1 col-span-6">
          <FormField
            control={form.control}
            name="operating_system"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operating System</FormLabel>
                <FormControl>
                  <Input placeholder="Operating System" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-1 col-span-6">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Model" {...field} />
                </FormControl>
                <FormMessage />
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
