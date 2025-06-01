import {useMutation} from "@tanstack/react-query";

import {authService} from "@/entities/Auth/Auth.module";

import {accessTokenStorage} from "@/shared/lib/storage";

import {getErrorMessage} from "@/shared/lib/getErrorMessage.js";

export const useLogin = (argument) => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess(response) {
      if (response.data) {
        accessTokenStorage.save(response.data?.access);
        argument.onSuccess("login");
      }
    },
    onError(error) {
      console.dir(error);
      argument.onError(getErrorMessage(error));
    },
  });
}