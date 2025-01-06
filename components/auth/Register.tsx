"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaSpinner } from "react-icons/fa";
import ErrorComponent from "../Error";
import { isObjectEmpty } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [customError, setCustomError] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      surname: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", { message: "Passwords don't match" });
      form.setError("password", { message: "Passwords don't match" });
      return null;
    }

    setIsLoading(true);
    setCustomError(false);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.field) {
        if (data.field == "password") {
          form.setError("password", { message: data.error });
          form.setError("confirmPassword", { message: data.error });
        }
        form.setError(data.field, { message: data.error });
      }
      if (data.error) {
        throw new Error("Something went wrong");
      }
      if (isObjectEmpty(form.formState.errors) && !data.error) {
        router.push("/memoryApp/login");
      }
    } catch (err) {
      console.log(err);
      setCustomError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] bg-white mx-auto rounded-md p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                {form.formState.errors["username"] ? (
                  <FormMessage />
                ) : (
                  <FormDescription>You can change it later</FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                {form.formState.errors["email"] ? (
                  <FormMessage />
                ) : (
                  <FormDescription>
                    Your email to receive verification code
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {customError && (
            <ErrorComponent error="Something went wrong, try again later!" />
          )}
          <Button
            type="submit"
            className={`max-w-[84px] w-full text-center`}
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Register;
