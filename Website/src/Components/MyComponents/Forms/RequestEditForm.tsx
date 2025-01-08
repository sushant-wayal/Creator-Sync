"use client";

import { requestEdit } from "@/actions/requestEdit";
import { getAddress } from "@/actions/user";
import { Button } from "@/Components/ui/button";
import { DialogFooter } from "@/Components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { RequestEditFormSchema } from "@/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface RequestEditFormProps {
  projectId: string;
}

export const RequestEditForm : React.FC<RequestEditFormProps> = ({ projectId }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof RequestEditFormSchema>>({
    resolver: zodResolver(RequestEditFormSchema),
  });
  const onSubmit = async(values: z.infer<typeof RequestEditFormSchema>) => {
    const toastId = toast.loading("Requesting Edit...");
    try {
      const address = await getAddress();
      if (!address) {
        toast.error("Your account address is not connected", { id: toastId });
        return;
      }
      const { budget } = values;
      const budgetInNumber = Number(budget);
      if (budgetInNumber <= 0) {
        toast.error("Budget must be greater than 0", { id: toastId });
        return;
      }
      await requestEdit(projectId, budgetInNumber);
      toast.success("Edit Requested", { id: toastId });
      router.refresh();
    } catch (error : any) {
      toast.error(`Error ${"Requesting Edit"} : ${error.response.data.message || "Try Again"}`, { id: toastId })
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
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Budget (USD)
              </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Budget"
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
            Request Edit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}