"use client";

import { updateUser } from "@/actions/user";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { CardContent, CardFooter } from "@/Components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { EditProfileFormSchema } from "@/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SingleImageUpload } from "../General/SingleImageUpload";

interface EditProfileFormProps {
  user: {
    profilePicture: string | null;
    name: string;
    username: string;
    bio: string | null;
    location: string | null;
    email: string;
    website: string | null;
    youtubeLink: string | null;
    xLink: string | null;
    instagramLink: string | null;
    skills: string[];
  };
}

export const EditProfileForm : React.FC<EditProfileFormProps> = ({ user : {
  profilePicture,
  name,
  username,
  bio,
  location,
  email,
  website,
  youtubeLink,
  xLink,
  instagramLink,
  skills
} }) => {
  const router = useRouter();
  const [userSkills, setUserSkills] = useState<string[]>(skills);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(profilePicture);
  const form = useForm<z.infer<typeof EditProfileFormSchema>>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      name,
      username,
      bio,
      location,
      email,
      website,
      youtubeLink,
      xLink,
      instagramLink,
      skills
    }
  });
  const onSubmit = async (values: z.infer<typeof EditProfileFormSchema>) => {
    const toastId = toast.loading("Saving Changes...");
    try {
      const { name, username, bio, location, email, website, youtubeLink, xLink, instagramLink } = values;
      await updateUser(username, {
        profilePicture: userProfilePicture,
        name,
        username,
        bio,
        location,
        email,
        website,
        youtubeLink,
        xLink,
        instagramLink,
        skills: userSkills
      });
      toast.success("Profile Updated", { id: toastId });
      router.push(`/profile/${username}`);
    } catch (error : any) {
      toast.error(`Error Updating Profile : ${error.response.data.message || "Try Again"}`, { id: toastId });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
      >
        <CardContent className="space-y-4">
          <SingleImageUpload setUrl={setUserProfilePicture} buttonText="Upload Profile Picture"/>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    value={field.value || ""}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Bio"
                    {...field}
                    value={field.value || ""}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Location"
                    {...field}
                    value={field.value || ""}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    value={field.value || ""}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Website
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Website"
                    {...field}
                    value={field.value || ""}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="youtubeLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Youtube Link
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Youtube Link"
                    {...field}
                    value={field.value || ""}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="xLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  X Link
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="X Link"
                    {...field}
                    value={field.value || ""}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagramLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Instagram Link
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Instagram Link"
                    {...field}
                    value={field.value || ""}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <div className="flex flex-col items-start space-y-4">
            <FormLabel> Skills </FormLabel>
            <Input
              placeholder="Add Skills"
              className="placeholder:text-[#444444] w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = e.currentTarget.value.toLowerCase();
                  if (value) {
                    if (!userSkills.includes(value)) setUserSkills([...userSkills, value]);
                    e.currentTarget.value = "";
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex justify-center items-center gap-1">
                  <p>{skill}</p>
                  <X size={12} className="cursor-pointer" onClick={() => setUserSkills(userSkills.filter(s => s !== skill))} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button
            type="button"
            className="w-1/5"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-1/5"
            disabled={form.formState.isSubmitting}
          >
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Form>
  )
}