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

export const updateSchema = z.object({
  firstname: z.string(),
  surname: z.string(),
  lastname: z.string(),
  age: z.string(),
  gender: z.string(),
  education_level: z.string(),
  ethnicity: z.string().optional(),
  martial_status: z.string(),
  phone: z.string(),
  phone2: z.string().optional(),
  household_above_hs: z.string().optional(),
  household_dependants: z.string().optional(),
  household_men: z.string().optional(),
  household_woman: z.string().optional(),
  unique_identifier: z.string().optional(),
  email: z.string().optional(),
  is_student: z.boolean(),
});

export type UpdateParticipant = z.infer<typeof updateSchema>;

export function DemographyForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UpdateParticipant>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    const getData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("participants")
        .select(
          "firstname,surname,lastname,age,gender,education_level,ethnicity,martial_status,phone,phone2,household_above_hs,household_dependants,household_men,household_woman,unique_identifier,email,is_student"
        )
        .eq("id", id);

      const participant = data?.at(0);
      if (!participant) return;

      form.reset({
        firstname: participant.firstname ?? "",
        surname: participant.surname ?? "",
        lastname: participant.lastname ?? "",
        age: participant.age?.toString(),
        gender: participant.gender ?? "",
        education_level: participant.education_level ?? "",
        ethnicity: participant.ethnicity ?? "",
        martial_status: participant.martial_status ?? "",
        phone: participant.phone ?? "",
        phone2: participant.phone2 ?? "",
        household_above_hs: participant.household_above_hs?.toString(),
        household_dependants: participant.household_dependants?.toString(),
        household_men: participant.household_men?.toString(),
        household_woman: participant.household_woman?.toString(),
        unique_identifier: participant.unique_identifier ?? "",
        email: participant.email ?? "",
      });
    };

    getData();
  }, []);

  const update = async (update: UpdateParticipant) => {
    setIsLoading(true);

    const supabase = createClient();

    const participant: Database["public"]["Tables"]["participants"]["Update"] =
      {
        ...update,
        age: parseInt(update.age),
        household_above_hs: update.household_above_hs
          ? parseInt(update.household_above_hs)
          : undefined,
        household_dependants: update.household_dependants
          ? parseInt(update.household_dependants)
          : undefined,
        household_men: update.household_men
          ? parseInt(update.household_men)
          : undefined,
        household_woman: update.household_woman
          ? parseInt(update.household_woman)
          : undefined,
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
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Surname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grand Father Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lastname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Of Birth </FormLabel>
                  <FormControl>
                    <Input placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1 col-span-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="gender">Gender</Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
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
              name="education_level"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="education_level">Education Level</Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Education Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bsc">BSc</SelectItem>
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
              name="martial_status"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="martial_status">Martial Status</Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Martial Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="unmarried">Unmarried</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
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
                  <FormLabel>Secondary Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Secondary Phone" {...field} />
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
                    <Input placeholder="Unique Identifier" {...field} />
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
            <h3 className="text-lg font-bold">Household</h3>
          </div>
          <div className="space-y-1 col-span-6">
            <FormField
              control={form.control}
              name="household_men"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Household Men</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Household Men"
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
              name="household_woman"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Household Woman</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Household Woman"
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
              name="household_dependants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dependants Without Job</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Dependants Without Job"
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
              name="household_above_hs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highscool Graduates</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Highscool Graduates"
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
