import { z } from "zod"

export const LoginFormSchema = z.object({
  usernameOrEmail: z.string().min(1,{
    message: "Username or Email is Required"
  }),
  password: z.string().min(1, {
    message: "Password is Required"
  }),
})

export const SignUpFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is Required"
  }),
  username: z.string().min(1, {
    message: "Username is Required"
  }),
  email: z.string().email({
    message: "Invalid Email"
  }),
  password: z.string().min(1, {
    message: "Password is Required"
  }),
  dob: z.date({
    required_error: "Date of Birth is Required"
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Invalid Gender"
  })
})

export const EmailFormSchema = z.object({
  email: z.string().min(1, {
    message: "Email is Required"
  }).email({
    message: "Invalid Email"
  })
})

export const ResetPasswordFormSchema = z.object({
  email: z.string().min(1, {
    message: "Email is Required"
  }).email({
    message: "Invalid Email"
  }),
  password: z.string().min(1, {
    message: "Password is Required"
  }),
  confirmPassword: z.string().min(1, {
    message: "Confirm Password is Required"
    })
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
})

export const NewProjectFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is Required"
  }),
  description: z.string().min(1, {
    message: "Description is Required"
  }),
  projectType: z.enum(["VLOG", "SHORT_FILM", "COMMERCIAL", "MUSIC_VIDEO", "DOCUMENTARY"], {
    message: "Invalid Project Type"
  }),
  duration: z.number().int().min(1, {
    message: "Duration is Required"
  }),
  deadline: z.date({
    message: "Invalid Deadline"
  }),
})