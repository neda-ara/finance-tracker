"use client";

import { Abril_Fatface } from "next/font/google";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Eye, EyeOff, Lock, Mail, MoveRight } from "lucide-react";
import { Input } from "../ui/input";
import { login } from "@/actions/auth/login";
import { loginInputSchema } from "@/lib/schema/login-schema";
import { resolveAction } from "@/lib/actions/helpers";
import { ROUTES } from "@/lib/constants/constants";
import { SocialMediaOptions } from "./social-media-options";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import toast from "react-hot-toast";
import z from "zod";

const abrilFatface = Abril_Fatface({
  weight: ["400"],
});

type LoginInput = z.infer<typeof loginInputSchema>;

export const LoginForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    const formData = new FormData();

    formData.append("email", values.email);
    formData.append("password", values.password);

    const resp = resolveAction(await login(formData));

    if (resp.success) {
      toast.success("Logged in successfully!");
      router.push(ROUTES.DASHBOARD.EXPENSES);
      return;
    }

    if (resp.error.kind === "field") {
      Object.entries(resp.error.errors).forEach(([field, message]) => {
        form.setError(field as "email" | "password", { message });
      });
    } else {
      toast.error(resp.error.message);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev: boolean) => !prev);
  };

  const commonStyles: Record<string, string> = {
    inputContainer: "relative flex items-center group",
    inputIconContainer: "absolute left-3",
    inputIcon: "group-focus-within:text-(--color-cta)",
    input:
      "pl-12 focus-visible:border-2 focus-visible:border-(--color-cta) focus-visible:ring-0 selection:bg-(--color-primary) selection:text-black",
  };

  return (
    <div className="flex flex-col w-full space-y-4 px-6">
      <div className="text-center mb-4">
        <h1 className={`${abrilFatface.className} text-4xl tracking-wider`}>
          Welcome Back
        </h1>
        <h3 className="text-gray-500 mt-1">
          Pick up right where you left off.
        </h3>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full flex flex-col"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Email</FormLabel>
                <FormControl>
                  <div className={commonStyles.inputContainer}>
                    <div className={commonStyles.inputIconContainer}>
                      <Mail className={commonStyles.inputIcon} />
                    </div>
                    <Input
                      {...field}
                      placeholder="Enter Email Address"
                      className={commonStyles.input}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <div className={commonStyles.inputContainer}>
                    <div className={commonStyles.inputIconContainer}>
                      <Lock className={commonStyles.inputIcon} />
                    </div>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className={commonStyles.input}
                    />
                    <div
                      className="absolute right-3 cursor-pointer"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <Eye className="h-5" />
                      ) : (
                        <EyeOff className="h-5" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="link"
            className="text-amber-600 font-medium px-0 py-0 justify-end"
          >
            Forgot Password?
          </Button>
          <Button type="submit" variant="cta" className="w-full my-2">
            Log In <MoveRight />
          </Button>
        </form>
      </Form>
      <SocialMediaOptions />
      <p className="font-medium text-sm text-center">
        Don&apos;t have an account?&nbsp;
        <Link
          href={ROUTES.AUTH.SIGNUP}
          className="text-(--color-cta) hover:underline"
        >
          <strong>Sign Up Here</strong>
        </Link>
      </p>
    </div>
  );
};
