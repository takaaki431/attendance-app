import { useMutation } from "@tanstack/react-query";
import { login } from "./api";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ loginId, password }: { loginId: string; password: string }) =>
      login(loginId, password),
  });
};
