import { z } from "zod";

// Auth

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email()
    .trim()
    .toLowerCase(),
});
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

// Signin Form Schema
export const LoginFormSchema = ForgotPasswordSchema.merge(
  z.object({
    password: z.string().min(1, { message: "Password is required" }).min(6),
  })
);
export type LoginFormData = z.infer<typeof LoginFormSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z.string().nonempty("Password is required").min(6),
    confirmPassword: z.string().nonempty("Password is required").min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export const UpdatePasswordSchema = z.object({
  oldPassword: z
    .string()
    .nonempty("Old password is required")
    .min(6, "Old password must be at least 6 characters"),
  newPassword: z
    .string()
    .nonempty("New password is required")
    .min(6, "New password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .nonempty("Confirm password is required")
    .min(6, "Confirm password must be at least 6 characters"),
});

export type UpdatePasswordFormData = z.infer<typeof UpdatePasswordSchema>;

export type ResetPasswordRequest = Omit<
  ResetPasswordFormData,
  "confirmPassword"
> & {
  email: string;
};

// Topics
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const AddInsightSchema = z.object({
  thumbnailImageFile: z.custom<FileList>().refine((files) => {
    return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
  }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
  description: z
    .string()
    .min(50, { message: "Description must be at least 50 characters" }),
  title: z
    .string()
    .min(6, { message: "Title is required" })
    .max(50, { message: "Title must be less than 50 characters" }),
  descriptionAmh: z
    .string()
    .min(50, { message: "Description (Amh) must be at least 50 characters" }),
  titleAmh: z
    .string()
    .min(6, { message: "Title (Amh) is required" })
    .max(50, { message: "Title (Amh) must be less than 50 characters" }),
  topic: z.string().min(2, { message: "Topic cannot be empty" }),
  rank: z.string().min(1, "Rank is required"),
  trimesters: z
    .array(z.string())
    .nonempty({ message: "At least one trimester is required" }),
  pregnancyWeeks: z
    .array(z.string())
    .nonempty({ message: "At least one pregnancy week is required" }),
});

export type AddInsightFormData = z.infer<typeof AddInsightSchema>;

export const EditInsightSchema = z.object({
  thumbnailImageFile: z.any().optional(),
  description: z
    .string()
    .min(50, { message: "Description must be at least 50 characters" }),
  title: z
    .string()
    .min(6, { message: "Title is required" })
    .max(50, { message: "Title must be less than 50 characters" }),
  descriptionAmh: z
    .string()
    .min(50, { message: "Description (Amh) must be at least 50 characters" }),
  titleAmh: z
    .string()
    .min(6, { message: "Title (Amh) is required" })
    .max(50, { message: "Title (Amh) must be less than 50 characters" }),
  topic: z.string().min(2, { message: "Topic cannot be empty" }),
  rank: z.string().min(1, "Rank is required"),
  trimesters: z
    .array(z.string())
    .nonempty({ message: "At least one trimester is required" }),
  pregnancyWeeks: z
    .array(z.string())
    .nonempty({ message: "At least one pregnancy week is required" }),
});

export type EditInsightFormData = z.infer<typeof EditInsightSchema>;

export const AddTopicSchema = z.object({
  thumbnailImageFile: z.custom<FileList>().refine((files) => {
    return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
  }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
  description: z
    .string()
    .min(50, { message: "Description must be at least 50 characters" }),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title must be less than 50 characters" }),
  descriptionAmh: z
    .string()
    .min(50, { message: "Description (Amh) must be at least 50 characters" }),
  titleAmh: z
    .string()
    .min(1, { message: "Title (Amh) is required" })
    .max(50, { message: "Title (Amh) must be less than 50 characters" }),
  category: z.string().min(2, { message: "Category cannot be empty" }),
  rank: z.string().min(1, "Rank is required"),
});

export type AddTopicFormData = z.infer<typeof AddTopicSchema>;

export const EditTopicSchema = z.object({
  thumbnailImageFile: z.any().optional(),
  description: z
    .string()
    .min(50, { message: "Description must be at least 50 characters" }),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title must be less than 50 characters" }),
  descriptionAmh: z
    .string()
    .min(50, { message: "Description (Amh) must be at least 50 characters" }),
  titleAmh: z
    .string()
    .min(1, { message: "Title (Amh) is required" })
    .max(50, { message: "Title (Amh) must be less than 50 characters" }),
  category: z.string().min(2, { message: "Category cannot be empty" }),
  rank: z.string().min(1, "Rank is required"),
});

export type EditTopicFormData = z.infer<typeof EditTopicSchema>;

// User

export const AddUserSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export type AddUserFormData = z.infer<typeof AddUserSchema>;

export const AddDoctorSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return value;
      if (/^[79]\d{8}$/.test(value)) {
        return `+251${value}`;
      }
      return value; // Return unchanged if it doesn't match
    })
    .refine((value) => !value || /^\+251[79]\d{8}$/.test(value), {
      message:
        "Phone number must start with +251 followed by 7 or 9 and contain 8 digits in total after the country code",
    }),
});

export type AddDoctorFormData = z.infer<typeof AddDoctorSchema>;

export const AddPatientSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" }),
    email: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.string().email().safeParse(value).success,
        {
          message: "Invalid email address",
        }
      ),
    phoneNumber: z
      .string()
      .optional()
      .refine((value) => !value || /^\+251[79]\d{8}$/.test(value), {
        message:
          "Phone number must start with +251 followed by 7 or 9 and contain 8 digits in total after the country code",
      }),

    menstrualDate: z.string().optional(),
    firstUltrasound: z.string().optional(),
    gestationalWeek: z.string().optional(),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "Either email or phone number is required",
    path: ["email", "phoneNumber"], // Indicates where the error applies
  })
  .refine(
    (data) =>
      !!data.menstrualDate ||
      (!!data.gestationalWeek && !!data.firstUltrasound),
    {
      message:
        "Either Menstrual Date must be provided, or both Gestational Week and First Ultrasound must be filled.",
      path: ["menstrualDate"],
    }
  );

export type AddPatientFormData = z.infer<typeof AddPatientSchema>;

export const CategoryFormSchema = z.object({
  rank: z.string().min(1, "Rank is required"),
  title: z
    .string()
    .min(6, "Title must be at least 6 characters long")
    .max(50, "Title cannot exceed 50 characters"),
  titleAmh: z
    .string()
    .min(6, "Title (Amh) must be at least 6 characters long")
    .max(50, "Title (Amh) cannot exceed 50 characters"),
});

export type AddCategoryFormData = z.infer<typeof CategoryFormSchema>;

export const UpdateProfileSchema = z.object({
  profileImageFile: z.any().optional(),
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  bio: z.any().optional(),
  email: z.string().email({ message: "Invalid email address" }),
});

export type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;

// Create DidYouKnowFormSchema
export const DidYouKnowFormSchema = z.object({
  category: z.string().min(2, { message: "Category cannot be empty" }),
  trimester: z.number(),

  day: z.number(),
  text: z.object({
    en: z
      .string()
      .nonempty({ message: "Text in English is required" })
      .min(5, { message: "Text should be at least 5 characters long" }),
  }),
});
// Define the type for the form data based on the schema
export type DidYouKnowFormData = z.infer<typeof DidYouKnowFormSchema>;
