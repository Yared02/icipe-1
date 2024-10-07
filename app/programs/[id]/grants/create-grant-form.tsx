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
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const createGrantSchema = z.object({
  name: z.string(),
  total_amount: z.string(),
  default_disbursement_amount: z.string(),
  from: z.string(),
  to: z.string(),
  description: z.string(),
  status: z.string(),
});

export type CreateGrant = z.infer<typeof createGrantSchema>;

export function CreateGrantForm({
  programId,
  onSuccess,
}: {
  programId: string;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationForm, setApplicationForm] = useState<File | null>(null);

  const form = useForm<CreateGrant>({
    resolver: zodResolver(createGrantSchema),
  });

  const create = async (createGrant: CreateGrant) => {
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.from("grants").insert({
      ...createGrant,
      total_amount: parseInt(createGrant.total_amount ?? "0"),
      default_disbursement_amount: parseInt(
        createGrant.default_disbursement_amount ?? "0"
      ),
      application_form: (await upload(applicationForm)) ?? undefined,
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

  const upload = async (file: File | null) => {
    if (!file) return;

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const filePath = `${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("grant_application_forms")
      .upload(filePath, file);

    if (uploadError) {
      toast.error(uploadError.message);
      console.error(uploadError);
      return;
    }

    return filePath;
  };

  const handleApplicationFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setApplicationForm(file);
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
        <div className="space-y-1 col-span-12">
          <FormField
            control={form.control}
            name="total_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Total Amount in ETB"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-1 col-span-12">
          <FormField
            control={form.control}
            name="default_disbursement_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Per Person</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Per Person Amount in ETB"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-1 col-span-12">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
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
          <FormItem>
            <FormLabel>Application Form</FormLabel>
            <FormControl>
              <Input
                type="file"
                placeholder="Application Form"
                onChange={handleApplicationFormChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
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
