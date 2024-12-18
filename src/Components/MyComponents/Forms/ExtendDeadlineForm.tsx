"use client";

import { extendDeadline } from "@/actions/project";
import { Button } from "@/Components/ui/button";
import { DialogFooter } from "@/Components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { ExtendDeadlineFormSchema } from "@/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ExtendDeadlineFormProps {
  projectId: string;
  isCreator: boolean;
}

export const ExtendDeadlineForm : React.FC<ExtendDeadlineFormProps> = ({ projectId, isCreator }) => {
  const form = useForm<z.infer<typeof ExtendDeadlineFormSchema>>({
    resolver: zodResolver(ExtendDeadlineFormSchema),
  });
  const onSubmit = async(values: z.infer<typeof ExtendDeadlineFormSchema>) => {
    const toastId = toast.loading("Extending Deadline...")
    try {
      const { days } = values;
      if (isCreator) await extendDeadline(projectId, days);
      // else await requestDeadlineExtension(projectId, days);
      toast.success("Deadline Extended", { id: toastId });
    } catch (error : any) {
      toast.error(`Error Extending Deadline : ${error.response.data.message || "Try Again"}`, { id: toastId })
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
          name="days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                New Deadline
              </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Days"
                    {...field}
                    className="placeholder:text-[#444444] w-full"
                    type="number"
                  />
                </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Extend Deadline
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}