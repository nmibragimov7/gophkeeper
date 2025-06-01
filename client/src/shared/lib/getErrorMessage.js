import {AxiosError} from "axios";

export const getErrorMessage = (error) => {
  if (error instanceof AxiosError && error) {
    return error.response?.data?.message || error.message;
  }
  return "Неизвестная ошибка";
};
