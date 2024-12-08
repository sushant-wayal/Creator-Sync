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