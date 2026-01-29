"use client";

import {
  ActionResult,
  LabelValuePair,
  SatisfactionRating,
} from "@/lib/actions/types";
import {
  AMOUNT_INPUT_REGEX,
  CURRENCIES,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_BASE_PATH,
  PAYMENT_MODE,
  SATISFACTION_RATING_LABELS,
  VALIDATION,
} from "@/lib/constants/constants";
import { Button } from "../ui/button";
import { expenseInputSchema } from "@/lib/schema/expense-schema";
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
import { Slider } from "../ui/slider";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import toast from "react-hot-toast";
import z from "zod";

type ExpenseInput = z.input<typeof expenseInputSchema>;

export const ExpenseForm = ({
  onCancel,
  onSubmit,
  submitButtonText,
  submitInProgress,
}: {
  onCancel: () => void;
  onSubmit: (values: FormData) => Promise<ActionResult<void>>;
  submitButtonText: string;
  submitInProgress: boolean;
}) => {
  const form = useForm<ExpenseInput>({
    resolver: zodResolver(expenseInputSchema),
    defaultValues: {
      amount: "",
      currency: CURRENCIES.INR.code,
      category: "Food",
      description: "",
      paymentMode: "online",
      satisfactionRating: 4,
      expenseDate: new Date(),
    },
  });

  const handleOnSubmit = async (values: ExpenseInput) => {
    const formData = new FormData();

    formData.append("amount", String(values.amount));
    formData.append("currency", values.currency);
    formData.append("category", values.category);
    formData.append("paymentMode", values.paymentMode);
    formData.append("description", values.description ?? "");
    formData.append("satisfactionRating", String(values.satisfactionRating));
    formData.append(
      "expenseDate",
      values.expenseDate instanceof Date
        ? values.expenseDate.toISOString()
        : String(values.expenseDate)
    );

    const resp = await onSubmit(formData);

    if (!resp.ok) {
      if (resp.error.fieldErrors) {
        Object.entries(resp.error.fieldErrors).forEach(([k, msg]) =>
          form.setError(k as keyof ExpenseInput, { message: msg })
        );
      }
      if (resp.error.message) {
        toast.error(resp.error.message);
      }
      return;
    }

    toast.success("Expense recorded successfully!");
    onCancel();
  };

  const currency = useWatch({
    control: form.control,
    name: "currency",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="flex flex-col gap-y-5 mt-3"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-x-8 self-center my-2">
              <FormControl>
                <div className="flex justify-center items-center self-center">
                  <FormLabel className="text-sm font-medium mr-24 min-w-fit">
                    Amount Spent
                  </FormLabel>
                  <p className="font-semibold text-4xl">
                    {currency &&
                      CURRENCIES[currency as keyof typeof CURRENCIES].symbol}
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
                        Number(value || 0) <= VALIDATION.MAX_AMOUNT_LIMIT
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
            name="expenseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Expense Date
                </FormLabel>
                <FormControl>
                  <DatePicker
                    value={
                      field.value instanceof Date ? field.value : undefined
                    }
                    onChange={field.onChange}
                    disabled={(date) => date > new Date()}
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
          <FormField
            control={form.control}
            name="paymentMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Mode of Payment
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Mode of Payment" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {PAYMENT_MODE.map((mode: LabelValuePair) => (
                        <SelectItem key={mode.value} value={mode.value}>
                          {mode.label}
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
            <FormItem className="flex-1">
              <FormLabel className="text-sm font-medium">
                Pick a Category
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {EXPENSE_CATEGORIES.slice(0, 5).map((category) => (
                    <div
                      key={category.title}
                      onClick={() => field.onChange(category.title)}
                      className={cn(
                        "flex items-center justify-center rounded-full h-14 aspect-square font-medium border-2 transition cursor-pointer",
                        category.title === field.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-accent border-muted"
                      )}
                    >
                      <Image
                        alt={category?.title}
                        height={64}
                        width={64}
                        className="h-9 w-9 object-contain"
                        src={`${EXPENSE_CATEGORY_BASE_PATH}${category?.iconPath}`}
                      />
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            const maxLength = VALIDATION.MAX_DESCRIPTION_LENGTH;
            const currentLength = field.value?.length ?? 0;

            return (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none text-sm py-1.5 min-h-14.5"
                    placeholder="Add notes about this expense (optional)"
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
                        : "text-muted-foreground"
                    )}
                  >
                    {currentLength}/{maxLength}
                  </span>
                </div>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="satisfactionRating"
          render={({ field }) => {
            const value = field.value;

            return (
              <FormItem className="flex-1">
                <FormLabel className="text-sm font-medium">
                  Was this spend worth it?
                </FormLabel>
                <FormControl>
                  <div className="flex gap-3">
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[value]}
                      onValueChange={([val]) => field.onChange(val)}
                    />
                    <div className="min-w-32">
                      <p className="text-sm text-muted-foreground text-center">
                        {
                          SATISFACTION_RATING_LABELS[
                            value as SatisfactionRating
                          ]
                        }
                      </p>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="space-x-2 self-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="cta" type="submit">
            {submitInProgress ? <Spinner /> : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
