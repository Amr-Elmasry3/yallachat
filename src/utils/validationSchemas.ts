// Import Zod Library
import { z } from "zod";

/* ----- Register Schema ------ */
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, {
        message: "Username is requried.",
      })
      .min(6, {
        message: "Username must be at least 6 characters.",
      }),
    email: z
      .string()
      .min(1, {
        message: "Email is required",
      })
      .email({
        message: "Invalid email address",
      }),
    phone: z.string().min(1, {
      message: "Phone number is required",
    }),
    password: z
      .string()
      .min(1, {
        message: "Password is required",
      })
      .min(8, {
        message: "The password must be at least 8 characters long.",
      }),
  })
  .refine((data) => /^01[0-2,5]{1}[0-9]{8}$/.test(data.phone), {
    message:
      "The phone number must start with 010, 011, 012, 015 and consist of 11 digits.",
  });

/* ----- Login Schema ------ */
export const loginSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

/* ----- Change Password Schema ------ */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required",
    }),
    newPassword: z
      .string()
      .min(1, {
        message: "New password is required",
      })
      .min(8, {
        message: "The password must be at least 8 characters long.",
      }),
    confirmNewPassword: z.string().min(1, {
      message: "Confirm New password is required",
    }),
  })
  .refine(
    (data) => {
      // If a new password is entered, check is not equal current password.
      if (data.currentPassword && data.newPassword) {
        return data.currentPassword !== data.newPassword;
      }
      return true;
    },
    {
      message: "New password must not equal current password",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      // If a password confirmation is entered, it checks for a match
      if (data.newPassword && data.confirmNewPassword) {
        return data.newPassword === data.confirmNewPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    },
  );

/* ----- Update User Info Schema ------ */
export const updateInfoSchema = z
  .object({
    username: z
      .string()
      .min(6, {
        message: "Username must be at least 6 characters.",
      })
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .email({
        message: "Invalid email address",
      })
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => !val || /^01[0-2,5]{1}[0-9]{8}$/.test(val), {
        message:
          "The phone number must start with 010, 011, 012, 015 and consist of 11 digits.",
      }),
    bio: z
      .string()
      .min(3, {
        message: "Bio must be at least 3 characters",
      })
      .max(60, {
        message: "Bio cannot exceed 60 characters",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // At Least One Field Must Be Provided
      const { username, email, phone, bio } = data;
      return username || email || phone || bio;
    },
    {
      message: "At least one field must be filled",
      path: ["username"], // Show Error On Username Field
    },
  );

/* ----- Add Friends Schema ------ */
export const addFriendsSchema = z.object({
  friendName: z.string().min(1, {
    message: "Friend name is requried",
  }),
  friendPhone: z
    .string()
    .min(1, {
      message: "Friend phone is requried",
    })
    .refine((val) => !val || /^01[0-2,5]{1}[0-9]{8}$/.test(val), {
      message:
        "The phone number must start with 010, 011, 012, 015 and consist of 11 digits.",
    }),
});
