"use client";

import { requestRevision } from "@/actions/instruction";
import { Button } from "@/Components/ui/button";
import { DialogFooter } from "@/Components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { RequestRevisionFormSchema } from "@/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface RequestRevisionFormProps {
  projectId: string;
}

export const RequestrevisionForm : React.FC<RequestRevisionFormProps> = ({ projectId }) => {
  const router = useRouter();
  const [nature, setNature] = useState<"COMPULSORY" | "OPTIONAL">("COMPULSORY");
  const form = useForm<z.infer<typeof RequestRevisionFormSchema>>({
    resolver: zodResolver(RequestRevisionFormSchema),
  });
  const onSubmit = async(values: z.infer<typeof RequestRevisionFormSchema>) => {
    const toastId = toast.loading("Requesting Revision...")
    try {
      const { content } = values;
      await requestRevision(projectId, content, nature);
      toast.success("Revision Requested Successfully", { id: toastId });
      router.refresh();
    } catch (error : any) {
      toast.error(`Error Requesting Revision. Try Again`, { id: toastId })
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Content
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Content"
                  {...field}
                  className="placeholder:text-[#444444] w-full"
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <Switch
            id="request-revision-nature"
            checked={nature === "COMPULSORY"}
            onCheckedChange={(e) => setNature(e ? "COMPULSORY" : "OPTIONAL")}
          />
          <Label htmlFor="request-revision-nature">
            Compulsory
          </Label>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Request Revision
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}