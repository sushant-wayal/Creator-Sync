"use client";

import { requestDeadlineExtension } from "@/actions/notification";
import { extendDeadline } from "@/actions/project";
import { getAddress } from "@/actions/user";
import { Button } from "@/Components/ui/button";
import { DialogFooter } from "@/Components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { paymentExtendDeadline } from "@/helper/contract";
import { ExtendDeadlineFormSchema } from "@/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ExtendDeadlineFormProps {
  projectId: string;
  isCreator: boolean;
}

export const ExtendDeadlineForm : React.FC<ExtendDeadlineFormProps> = ({ projectId, isCreator }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof ExtendDeadlineFormSchema>>({
    resolver: zodResolver(ExtendDeadlineFormSchema),
  });
  const onSubmit = async(values: z.infer<typeof ExtendDeadlineFormSchema>) => {
    const toastId = toast.loading(isCreator ? "Extending Deadline..." : "Requesting Deadline Extension...");
    try {
      const { days } = values;
      if (isCreator) {
        const address = await getAddress();
        if (!address) {
          toast.error("Your account address is not connected", { id: toastId });
          return;
        }
        await paymentExtendDeadline(projectId, Number(days));
        await extendDeadline(projectId, Number(days));
      }
      else await requestDeadlineExtension(projectId, Number(days));
      toast.success(isCreator ? "Deadline Extended" : "Requested Deadline Extension", { id: toastId });
      router.refresh();
    } catch (error : any) {
      toast.error(`Error ${isCreator ? "Extending Deadline" : "Requesting Deadline Extension"} : ${error.response.data.message || "Try Again"}`, { id: toastId })
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
            {isCreator ? "Extend Deadline" : "Request Deadline Extension"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}