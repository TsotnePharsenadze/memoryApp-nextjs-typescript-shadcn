import { z } from "zod";

export const registerSchema = z.object({
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
    .min(3, {
      message: "Email is required must contain at least 3 character(s)",
    })
    .max(50, {
      message: "Email must contain less than 51 character(s)",
    })
    .email(),
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

export const profileSchema = z.object({
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
    .min(3, {
      message: "Email is required must contain at least 3 character(s)",
    })
    .max(50, {
      message: "Email must contain less than 51 character(s)",
    })
    .email(),
  username: z
    .string()
    .min(8, {
      message: "Username is required must contain at least 8 character(s)",
    })
    .max(31, {
      message: "Username must contain less than 32 character(s)",
    }),
});

export const passwordSchema = z.object({
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

export const loginSchema = z.object({
  email: z
    .string()
    .min(3, {
      message: "Email is required must contain at least 3 character(s)",
    })
    .max(50, {
      message: "Email must contain less than 51 character(s)",
    })
    .email(),
  password: z
    .string()
    .min(8, {
      message: "Password is required must contain at least 8 character(s)",
    })
    .max(31, {
      message: "Password must contain less than 32 character(s)",
    }),
});
