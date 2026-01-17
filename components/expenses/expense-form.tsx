"use client";

import { Button } from "../ui/button";
import {
  AMOUNT_INPUT_REGEX,
  CURRENCIES,
  VALIDATION,
} from "@/lib/constants/constants";
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
import { normalizeNumber } from "@/lib/utils/utils";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

type ExpenseInput = z.input<typeof expenseInputSchema>;

export const ExpenseForm = ({
  submitButtonText,
  onCancel,
}: {
  submitButtonText: string;
  onCancel: () => void;
}) => {
  const form = useForm<ExpenseInput>({
    resolver: zodResolver(expenseInputSchema),
    defaultValues: {
      amount: "",
      currency: CURRENCIES.INR.code,
      category: "",
      description: "",
      paymentMode: "",
      satisfactionRating: 4,
      expenseDate: new Date(),
    },
  });

  const onSubmit = async (values: ExpenseInput) => {
    const formData = new FormData();

    formData.append("amount", String(values.amount));
    formData.append("currency", values.currency);
    formData.append("category", values.category);
    formData.append("paymentMode", values.paymentMode);
    formData.append("description", values.description);
    formData.append("satisfactionRating", String(values.satisfactionRating));
    formData.append("expenseDate", String(values.expenseDate));
  };

  const currency = useWatch({
    control: form.control,
    name: "currency",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4 w-full"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-8 self-center">
              <FormLabel className="text-sm font-medium">Amount</FormLabel>
              <FormControl>
                <div className="flex items-center gap-x-2 self-center">
                  {/* <div className={commonStyles.inputIconContainer}>
                      <User className={commonStyles.inputIcon} />
                    </div> */}
                  <p className="font-semibold text-4xl">
                    {currency &&
                      CURRENCIES[currency as keyof typeof CURRENCIES].symbol}
                  </p>
                  <Input
                    {...field}
                    autoFocus={true}
                    className="text-3xl! font-medium h-16 border-0 selection:ring-0 focus-visible:ring-0 shadow-none"
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Description
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter Description (optional)"
                  className=""
                  //className={commonStyles.input}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-x-2 self-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="cta" type="submit">
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
