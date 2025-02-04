"use client";

import getUserById from "@/actions/getUserById";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getChangedValues } from "@/lib/utils";
import { profileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { z } from "zod";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fullUserData, setFullUserData] = useState<User | null>(null);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof profileSchema
  > | null>(null);
  const user = useSession();

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    const newValues = getChangedValues(fullUserData!, values);
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify(newValues),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    async function fetchUserData() {
      const res = await getUserById(user?.data?.user?.id as string);
      setFullUserData(res);
    }
    if (user.status === "authenticated") {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (fullUserData) {
      form.reset({
        name: fullUserData.name || "",
        surname: fullUserData.surname || "",
        username: fullUserData.username || "",
        email: fullUserData.email || "",
      });
      setInitialValues({
        name: fullUserData.name || "",
        surname: fullUserData.surname || "",
        username: fullUserData.username || "",
        email: fullUserData.email || "",
      });
    }
  }, [fullUserData, form.reset]);

  useEffect(() => {
    if (!initialValues) return;

    const currentValues = form.getValues();
    const hasChanges = Object.keys(initialValues).some((key) => {
      const typedKey = key as keyof typeof initialValues;
      return currentValues[typedKey] !== initialValues[typedKey];
    });

    setIsModified(hasChanges);
  }, [form.watch(), initialValues]);

  return (
    <div className="max-w-4xl mx-auto sm:p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/user.jpg" alt="@shadcn" />
              <AvatarFallback>
                <Image src="/user.jpg" fill alt={"Fallback image of Avatar"} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {fullUserData?.name} {fullUserData?.surname}
              </h2>
              <p className="text-sm text-gray-600">@{fullUserData?.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex gap-4 sm:flex-row flex-col">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} className="flex-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 sm:flex-row flex-col">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between mt-4 sm:flex-row flex-col gap-4">
                  <Button
                    type="submit"
                    className={`sm:max-w-[84px] w-full text-center`}
                    disabled={!isModified || isLoading}
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                  <div className="flex sm:flex-row flex-col gap-4">
                    <DeleteAccountModal />

                    <ChangePasswordModal />
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
