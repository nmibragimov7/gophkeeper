import {useMutation} from "@tanstack/react-query";

import {secretService} from "@/entities/Secret/Secret.module.js";

import {getErrorMessage} from "@/shared/lib/getErrorMessage.js";

export const useUpdateSecret = (argument) => {
  return useMutation({
    mutationFn: secretService.update,
    onSuccess(response) {
      if (response.data) {
        argument.onSuccess("update");
      }
    },
    onError(error) {
      console.dir(error);
      argument.onError(getErrorMessage(error));
    },
  });
}