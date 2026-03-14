"use client";

import { ActionResult, Budget } from "@/lib/actions/types";
import {
  AMOUNT_INPUT_REGEX,
  CURRENCIES,
  VALIDATION,
} from "@/lib/constants/constants";
import { budgetInputSchema } from "@/lib/schema/budget-schema";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils/shadcn-utils";
import { DatePicker } from "../common/date-picker";
import { normalizeNumber } from "@/lib/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import z from "zod";

type BudgetInput = z.input<typeof budgetInputSchema>;

export const BudgetForm = ({
  initialValues,
  onCancel,
  onSubmit,
  submitButtonText,
  submitInProgress,
}: {
  initialValues?: Budget;
  onCancel: () => void;
  onSubmit: (values: FormData) => Promise<ActionResult<void>>;
  submitButtonText: string;
  submitInProgress: boolean;
}) => {
  const form = useForm<BudgetInput>({
    resolver: zodResolver(budgetInputSchema),
    defaultValues: {
      amount: initialValues?.amount ?? "",
      currency: initialValues?.currency ?? CURRENCIES.INR.code,
      category: initialValues?.category ?? "Food",
    },
  });

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    form.reset({
      amount: String(initialValues.amount),
      currency: initialValues.currency,
      category: initialValues.category,
    });
  }, [initialValues, form]);

  const handleOnSubmit = async (values: BudgetInput) => {
    const formData = new FormData();

    if (initialValues?.id) {
      formData.append("id", initialValues.id);
    }

    formData.append("amount", String(values.amount));
    formData.append("currency", values.currency);
    formData.append("category", values.category);

    const resp = await onSubmit(formData);

    if (!resp.ok) {
      if (resp.error.fieldErrors) {
        Object.entries(resp.error.fieldErrors).forEach(([k, msg]) =>
          form.setError(k as keyof BudgetInput, { message: msg }),
        );
      }
      if (resp.error.message) {
        toast.error(resp.error.message);
      }
      return;
    }

    toast.success("Budget recorded successfully!");
    onCancel();
  };

  const selectedCurrency = useWatch({
    control: form.control,
    name: "currency",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="flex flex-col gap-y-4"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-x-8 self-center my-2">
              <FormControl>
                <div className="flex justify-center items-center self-center">
                  <FormLabel className="text-sm font-medium mr-20 min-w-fit">
                    Amount Received
                  </FormLabel>
                  <p className="font-semibold text-4xl">
                    {selectedCurrency &&
                      CURRENCIES[selectedCurrency as keyof typeof CURRENCIES]
                        .symbol}
                  </p>
                  <Input
                    {...field}
                    autoFocus={true}
                    className="text-4xl! font-medium border-0 selection:ring-0 focus-visible:ring-0 shadow-none"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={field.value as string}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        AMOUNT_INPUT_REGEX.test(value) &&
                        Number(value || 0) <=
                          VALIDATION.EXPENSE.MAX_AMOUNT_LIMIT
                      ) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) => {
                      const normalizedVal = normalizeNumber(e.target.value);
                      field.onChange(normalizedVal);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-start gap-x-2">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-sm font-medium">Currency</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Object.entries(CURRENCIES).map(([code, currency]) => (
                        <SelectItem key={code} value={code}>
                          {code} ({currency.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-x-2 self-end mt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={submitInProgress}
          >
            Cancel
          </Button>
          <Button variant="cta" type="submit" disabled={submitInProgress}>
            {submitInProgress && <Spinner />}&nbsp;{submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
