"use client";

import {
  ActionResult,
  Expense,
  LabelValuePair,
  SatisfactionRating,
} from "@/lib/actions/types";
import {
  AMOUNT_INPUT_REGEX,
  CURRENCIES,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
  PAYMENT_MODE,
  SATISFACTION_ICONS_BASE_PATH,
  SATISFACTION_RATINGS,
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
import { Mochiy_Pop_One } from "next/font/google";
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
import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import toast from "react-hot-toast";
import z from "zod";

type ExpenseInput = z.input<typeof expenseInputSchema>;

const mochiyPopOne = Mochiy_Pop_One({
  weight: ["400"],
});

export const ExpenseForm = ({
  initialValues,
  onCancel,
  onSubmit,
  submitButtonText,
  submitInProgress,
}: {
  initialValues?: Expense;
  onCancel: () => void;
  onSubmit: (values: FormData) => Promise<ActionResult<void>>;
  submitButtonText: string;
  submitInProgress: boolean;
}) => {
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const form = useForm<ExpenseInput>({
    resolver: zodResolver(expenseInputSchema),
    defaultValues: {
      amount: initialValues?.amount ?? "",
      currency: initialValues?.currency ?? CURRENCIES.INR.code,
      category: initialValues?.category ?? "Food",
      description: initialValues?.description ?? "",
      paymentMode: initialValues?.paymentMode ?? "online",
      satisfactionRating: initialValues?.satisfactionRating ?? 4,
      expenseDate: initialValues?.expenseDate ?? new Date(),
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
      description: initialValues.description ?? "",
      paymentMode: initialValues.paymentMode,
      satisfactionRating: initialValues.satisfactionRating,
      expenseDate: new Date(initialValues.expenseDate),
    });
  }, [initialValues, form]);

  const handleOnSubmit = async (values: ExpenseInput) => {
    const formData = new FormData();

    if (initialValues?.id) {
      formData.append("id", initialValues.id);
    }

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

  const selectedCurrency = useWatch({
    control: form.control,
    name: "currency",
  });

  const selectedCategory = useWatch({
    control: form.control,
    name: "category",
  });

  useEffect(() => {
    if (!selectedCategory) {
      return;
    }

    const el = categoryRefs.current[selectedCategory];
    if (!el) {
      return;
    }

    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedCategory]);

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
                  <FormLabel className="text-sm font-medium mr-24 min-w-fit">
                    Amount Spent
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
            <FormItem className="flex-1 my-2">
              <FormLabel className="flex items-center justify-between text-sm font-medium">
                Category
                <div
                  onClick={() => {
                    const el = categoryRefs.current[field.value];
                    el?.scrollIntoView({
                      behavior: "smooth",
                      inline: "center",
                      block: "nearest",
                    });
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.boxShadow =
                      "inset 4px 4px 8px rgba(0,0,0,0.16), inset -4px -4px 8px rgba(255,255,255,0.92)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.boxShadow =
                      "4px 4px 10px rgba(0,0,0,0.10), -4px -4px 10px rgba(255,255,255,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "4px 4px 10px rgba(0,0,0,0.10), -4px -4px 10px rgba(255,255,255,0.85)";
                  }}
                  className="cursor-pointer select-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-150 bg-gray-50 border border-accent-muted"
                  style={{
                    boxShadow:
                      "4px 1px 6px rgba(0,0,0,0.10), -4px -4px 10px rgba(255,255,255,0.85)",
                  }}
                >
                  <span className="text-[11px] text-muted-foreground">
                    Selected:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {field.value}
                  </span>
                </div>
              </FormLabel>
              <FormControl>
                <div className="flex gap-3 overflow-x-scroll scrollbar-hide">
                  {EXPENSE_CATEGORIES.map((category) => {
                    const isSelected = category.title === field.value;
                    return (
                      <div
                        key={category.title}
                        onClick={() => field.onChange(category.title)}
                        className="flex flex-col items-center cursor-pointer"
                        ref={(el) => {
                          categoryRefs.current[category.title] = el;
                        }}
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
                            "flex items-center justify-center rounded-full h-17 aspect-square font-medium border-2 transition-all delay-100 ease-in",
                            isSelected
                              ? "bg-green-50 text-primary-foreground border-3 border-green-200"
                              : "bg-background hover:bg-accent border-muted"
                          )}
                        >
                          <Image
                            alt={category?.title}
                            height={64}
                            width={64}
                            className="h-11 w-11 object-contain"
                            src={`${EXPENSE_CATEGORY_ICONS_BASE_PATH}${category?.iconPath}`}
                          />
                        </div>
                        <span
                          className={cn(
                            "transition-colors duration-150 text-xs font-medium text-muted-foreground",
                            isSelected && "text-black"
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
            const rating =
              SATISFACTION_RATINGS[field.value as SatisfactionRating];

            return (
              <FormItem className="flex-1">
                <FormLabel className="text-sm font-medium">
                  Was this spend worth it?
                </FormLabel>
                <FormControl>
                  <div className="flex gap-x-4">
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={([val]) => field.onChange(val)}
                      sliderStyle={{
                        rangeClass: "bg-(--color-cta)",
                      }}
                    />
                    <div className="flex items-center justify-center gap-x-2 w-60">
                      <Image
                        alt={field.value.toString()}
                        height={64}
                        width={64}
                        className="h-11 w-11 object-contain"
                        src={`${SATISFACTION_ICONS_BASE_PATH}${rating.iconPath}`}
                      />
                      <p
                        className={`${mochiyPopOne.className} ${rating.color} font-semibold text-sm text-accent-foreground text-center tracking-wider`}
                      >
                        {rating.title}
                      </p>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
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
