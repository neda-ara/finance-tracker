"use client";

import { ActionResult, Earning } from "@/lib/actions/types";
import {
  AMOUNT_INPUT_REGEX,
  CURRENCIES,
  VALIDATION,
} from "@/lib/constants/constants";
import { Button } from "../ui/button";
import { earningInputSchema } from "@/lib/schema/earning-schema";
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
import { getCurrencySymbol, normalizeNumber } from "@/lib/utils/utils";
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

type EarningInput = z.input<typeof earningInputSchema>;

export const EarningForm = ({
  initialValues,
  onCancel,
  onSubmit,
  submitButtonText,
  submitInProgress,
}: {
  initialValues?: Earning;
  onCancel: () => void;
  onSubmit: (values: FormData) => Promise<ActionResult<void>>;
  submitButtonText: string;
  submitInProgress: boolean;
}) => {
  const form = useForm<EarningInput>({
    resolver: zodResolver(earningInputSchema),
    defaultValues: {
      amount: initialValues?.amount ?? "",
      currency: initialValues?.currency ?? CURRENCIES.INR.code,
      category: initialValues?.category ?? "Salary",
      description: initialValues?.description ?? "",
      source: initialValues?.source ?? "",
      receivedDate: initialValues?.receivedDate ?? new Date(),
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
      source: initialValues.source,
      description: initialValues.description ?? "",
      receivedDate: new Date(initialValues.receivedDate),
    });
  }, [initialValues, form]);

  const handleOnSubmit = async (values: EarningInput) => {
    const formData = new FormData();

    if (initialValues?.id) {
      formData.append("id", initialValues.id);
    }

    formData.append("amount", String(values.amount));
    formData.append("currency", values.currency);
    formData.append("category", values.category);
    formData.append("source", values.source ?? "");
    formData.append("description", values.description ?? "");
    formData.append(
      "receivedDate",
      values.receivedDate instanceof Date
        ? values.receivedDate.toISOString()
        : String(values.receivedDate),
    );

    const resp = await onSubmit(formData);

    if (!resp.ok) {
      if (resp.error.fieldErrors) {
        Object.entries(resp.error.fieldErrors).forEach(([k, msg]) =>
          form.setError(k as keyof EarningInput, { message: msg }),
        );
      }
      if (resp.error.message) {
        toast.error(resp.error.message);
      }
      return;
    }

    toast.success("Earning recorded successfully!");
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
                    {getCurrencySymbol(selectedCurrency)}
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
                          VALIDATION.EARNING.MAX_AMOUNT_LIMIT
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
            name="receivedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Received On Date
                </FormLabel>
                <FormControl>
                  <DatePicker
                    value={
                      field.value instanceof Date ? field.value : undefined
                    }
                    onChange={field.onChange}
                    customStyles={{ triggerButton: "min-w-50" }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        <div className="flex items-start gap-x-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel className="text-sm font-medium">
                  Income Category
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    placeholder="Salary/Freelance/Investment"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel className="text-sm font-medium">
                  Income Source (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    placeholder="Employer/Client/Platform"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            const maxLength = VALIDATION.MAX_DESCRIPTION_LENGTH;
            const currentLength = field.value?.length ?? 0;

            return (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Description (optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none text-sm py-1.5 min-h-14.5"
                    placeholder="Add notes about this earning"
                    maxLength={maxLength}
                    rows={2}
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <FormMessage />
                  <span
                    className={cn(
                      "text-xs font-medium ml-auto",
                      currentLength >= maxLength
                        ? "text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {currentLength}/{maxLength}
                  </span>
                </div>
              </FormItem>
            );
          }}
        />

        <div className="flex items-center gap-x-2 self-end mt-2">
          <Button
            type="button"
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
