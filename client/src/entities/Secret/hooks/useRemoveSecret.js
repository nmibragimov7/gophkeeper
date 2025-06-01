import {useMutation} from "@tanstack/react-query";

import {secretService} from "@/entities/Secret/Secret.module.js";

import {getErrorMessage} from "@/shared/lib/getErrorMessage.js";

export const useRemoveSecret = (argument) => {
  return useMutation({
    mutationFn: secretService.remove,
    onSuccess(response) {
      if (response.data) {
        argument.onSuccess("remove");
      }
    },
    onError(error) {
      console.dir(error);
      argument.onError(getErrorMessage(error));
    },
  });
}