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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(31, {
      message: "Name must contain less than 32 character(s)",
    }),
  surname: z
    .string()
    .min(1, {
      message: "Surname is required",
    })
    .max(31, {
      message: "Surname must contain less than 32 character(s)",
    }),
  email: z
    .string()
    .email()
    .min(3, {
      message: "Email is required must contain at least 3 character(s)",
    })
    .max(50, {
      message: "Email must contain less than 51 character(s)",
    }),
  username: z
    .string()
    .min(8, {
      message: "Username is required must contain at least 8 character(s)",
    })
    .max(31, {
      message: "Username must contain less than 32 character(s)",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password is required must contain at least 8 character(s)",
    })
    .max(31, {
      message: "Password must contain less than 32 character(s)",
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Password is required must contain at least 8 character(s)",
    })
    .max(31, {
      message: "Confirm Password must contain less than 32 character(s)",
    }),
});

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormDescription>
                  Your email to receive verification code
                </FormDescription>
                <FormMessage />
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
                  <Input
                    placeholder="********"
                    type="confirmPassword"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Register</Button>
        </form>
      </Form>
    </div>
  );
};

export default Register;
