import {useQuery} from "@tanstack/react-query";

import {secretService} from "@/entities/Secret/Secret.module.js";

import {getErrorMessage} from "@/shared/lib/getErrorMessage";

export const useSecrets = (argument) => {
  return useQuery({
    queryKey: [secretService.SECRETS, argument.meta],
    onError(error) {
      console.dir(error);
      argument.onError(getErrorMessage(error));
    },
    queryFn: () => {
      return secretService.secrets(argument.meta);
    },
  });
}