"use client";

import { AUTH_CLIENT_QUERY_KEY } from "@/lib/constants/query-keys";
import { login } from "@/actions/auth/login";
import { signup } from "@/actions/auth/signup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_CLIENT_QUERY_KEY] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_CLIENT_QUERY_KEY] });
    },
  });

  return {
    login: loginMutation,
    signup: signupMutation,
  };
}
