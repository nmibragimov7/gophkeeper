import {useMutation} from "@tanstack/react-query";

import {secretService} from "@/entities/Secret/Secret.module.js";

import {getErrorMessage} from "@/shared/lib/getErrorMessage.js";

export const useSaveSecret = (argument) => {
  return useMutation({
    mutationFn: secretService.save,
    onSuccess(response) {
      if (response.data) {
        argument.onSuccess("save");
      }
    },
    onError(error) {
      console.dir(error);
      argument.onError(getErrorMessage(error));
    },
  });
}