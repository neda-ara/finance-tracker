"use client";

import { ActionResult, Budget } from "@/lib/actions/types";
import {
  AMOUNT_INPUT_REGEX,
  CURRENCIES,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
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
import { getCurrencySymbol, normalizeNumber } from "@/lib/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import z from "zod";
import Image from "next/image";

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
        className="flex flex-col gap-y-4 mt-3"
      >
        <div className="flex items-center gap-x-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-sm font-medium">
                  Spending Limit
                </FormLabel>
                <div className="flex items-center self-center relative">
                  <p className="font-semibold text-3xl">
                    {getCurrencySymbol(selectedCurrency)}
                  </p>
                  <Input
                    {...field}
                    autoFocus={true}
                    className="text-3xl! font-medium border-0 selection:ring-0 focus-visible:ring-0 shadow-none"
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
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex-1 my-2">
              <FormLabel className="flex items-center justify-between text-sm font-medium">
                Category
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-8 gap-x-3 gap-y-1.5">
                  {EXPENSE_CATEGORIES.map((category) => {
                    const isSelected = category.title === field.value;
                    return (
                      <div
                        key={category.title}
                        onClick={() => field.onChange(category.title)}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <div
                          style={
                            isSelected
                              ? {
                                  boxShadow: `6px 6px 12px rgba(0,0,0,0.12), -6px -6px 1px rgba(255,255,255,0.9)`,
                                }
                              : {}
                          }
                          className={cn(
                            "flex items-center justify-center rounded-full h-15 aspect-square font-medium border-2 transition-all delay-100 ease-in",
                            isSelected
                              ? "bg-green-50 text-primary-foreground border-3 border-green-200"
                              : "bg-background hover:bg-accent border-muted",
                          )}
                        >
                          <Image
                            alt={category?.title}
                            height={64}
                            width={64}
                            className="h-9 w-9 object-contain"
                            src={`${EXPENSE_CATEGORY_ICONS_BASE_PATH}${category?.iconPath}`}
                          />
                        </div>
                        <span
                          className={cn(
                            "transition-colors duration-150 text-xs font-medium text-muted-foreground",
                            isSelected && "text-black",
                          )}
                        >
                          {category?.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
