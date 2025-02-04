"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { passwordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaSpinner } from "react-icons/fa";
import Error from "./Error";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ChangePasswordModal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitPassword = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile/password-update", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const closeDialog = () => {
        setDialogOpen(false);
      };

      const data = await response.json();

      if (!data.success) {
        setCustomError("Something went wrong");
      } else {
        closeDialog();
        signOut();
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitPassword)}
              id="passwordForm"
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <br />
              <hr />
              <br />
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                {customError !== "" && (
                  <Error error="Something went wrong! try again later!" />
                )}
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={isLoading} className="mt-4">
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
