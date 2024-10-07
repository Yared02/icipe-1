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
import { CreateParticipant, createParticipantSchema } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

export function CreateParticipantForm({
  programId,
  onSuccess,
}: {
  programId: string;
  onSuccess?: (id: number) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateParticipant>({
    resolver: zodResolver(createParticipantSchema),
  });

  const create = async (createParticipant: CreateParticipant) => {
    setIsLoading(true);
    const supabase = createClient();

    // Retrieve organization and created_by values from local storage
    const organization = localStorage.getItem("organization");
    const createdBy = localStorage.getItem("id");

    // Make sure to handle cases where these values may be null
    const { data, error } = await supabase
      .from("participants")
      .insert({
        ...createParticipant,
        age: parseInt(createParticipant.age ?? "0"),
        program_id: parseInt(programId),
        organization: organization || null, // Use retrieved organization value
        created_by: createdBy || null, // Use retrieved created_by value
      })
      .select("id");

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    const id = data?.at(0)?.id;
    if (id) {
      onSuccess && onSuccess(id);
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={form.handleSubmit(create)}
      >
        <div className="space-y-1 col-span-6">
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

        <div className="space-y-1 col-span-6">
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

        <div className="space-y-1 col-span-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Of birth</FormLabel>
                <FormControl>
                  <Input placeholder="dob" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-1 col-span-6">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="gender">Gender</Label>
                <FormControl>
                  <Select
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

        <div className="space-y-1 col-span-6">
          <FormField
            control={form.control}
            name="education_level"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="education_level">Education Level</Label>
                <FormControl>
                  <Select
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

        <div className="space-y-1 col-span-6">
          <FormField
            control={form.control}
            name="martial_status"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="martial_status">Martial Status</Label>
                <FormControl>
                  <Select
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

        <div className="space-y-1 col-span-12">
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

        <div className="col-span-12">
          <Separator />
        </div>

        <div className="space-y-1 col-span-6">
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

        <div className="space-y-1 col-span-6">
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

        <div className="space-y-1 col-span-6">
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

        <div className="space-y-1 col-span-6">
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
