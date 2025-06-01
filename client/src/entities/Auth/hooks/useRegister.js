import {useMutation} from "@tanstack/react-query";

import {authService} from "@/entities/Auth/Auth.module";

import {getErrorMessage} from "@/shared/lib/getErrorMessage.js";

export const useRegister = (argument) => {
  return useMutation({
    mutationFn: authService.register,
    onSuccess() {
      argument.onSuccess("register");
    },
    onError(error) {
      console.dir(error);
      argument.onError(getErrorMessage(error));
    },
  });
}