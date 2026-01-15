import z from "zod";
export const loginschema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
    location: z.string().min(1, "Location is required"),
    role: z.string().min(1, "Role is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  userName: z.string().min(1, "Username is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of Birth is required")
    .refine(
      (date) => {
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime());
      },
      { message: "Invalid date format" }
    )
    .refine(
      (date) => {
        const dateObj = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - dateObj.getFullYear();
        return age >= 13;
      },
      { message: "You must be at least 13 years old" }
    ),
  role: z.string().min(1, "Role is required"),
  primarySkill: z.enum(["Video creation", "Photo Creation"], {
    message: "Please select a primary skill",
  }),
  secondSkill: z.string().min(1, "Second skill is required"),
  experience: z
    .number()
    .min(0, "Experience must be 0 or greater")
    .max(50, "Experience cannot exceed 50 years"),
  profilePicture: z.string().optional(),
});
