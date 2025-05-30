import secretService from "./api/secret.service.js";
import {useSecrets} from "./hooks/useSecrets.js";
import {useSaveSecret} from "./hooks/useSaveSecret.js";
import {useRemoveSecret} from "./hooks/useRemoveSecret.js";
import {useUpdateSecret} from "./hooks/useUpdateSecret.js";

export {
  secretService,
  useSecrets,
  useSaveSecret,
  useRemoveSecret,
  useUpdateSecret,
}