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
import { accounDeleteSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaSpinner, FaTrash } from "react-icons/fa";
import Error from "./Error";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function DeleteAccountModal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof accounDeleteSchema>>({
    resolver: zodResolver(accounDeleteSchema),
    defaultValues: {
      keyword: "",
    },
  });

  const onSubmitPassword = async (
    values: z.infer<typeof accounDeleteSchema>
  ) => {
    if (values.keyword !== "DELETE") {
      setCustomError("Make sure that word is DELETE in uppercase");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile/account-delete", {
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
        <Button
          type="button"
          variant="outline"
          className="bg-red-600 text-white hover:bg-red-700 hover:text-white"
        >
          <FaTrash /> Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            All the records will be lost and you will be removed from
            leaderboard!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPassword)}>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="keyword"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>
                        Enter <span className="text-red-500">"DELETE"</span>{" "}
                        (Consider uppercase)
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
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
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isLoading}
                  className="mt-4"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Delete Account"
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
