import * as z from "zod";
import {
  PASSWORD_REGEX,
  USERNAME_REGEX,
} from "../../../../../shared/constants/regex";
import { translateValidationErrors } from "../../../../../shared/helpers/factory";
import useFormValidation from "../../../../../shared/hooks/useFormValidation";
import {
  USER_STATUS,
  USER_TYPE,
} from "../../../../../shared/types/models/User.model";
import zodPhoneNumber from "../../../../../shared/utils/validations/zodPhoneNumber";

// ADD USER SCHEMA OBJECT
const addUserSchema = z.object({
  username: z
    .string()
    .min(1, translateValidationErrors("USERNAME_REQUIRED"))
    .regex(USERNAME_REGEX, translateValidationErrors("USERNAME_REGEX")),
  email: z
    .string()
    .min(1, translateValidationErrors("EMAIL_REQUIRED"))
    .email(translateValidationErrors("INVALID_EMAIL")),
  password: z
    .string()
    .min(1, translateValidationErrors("PASSWORD_REQUIRED"))
    .regex(PASSWORD_REGEX, translateValidationErrors("PASSWORD_REGEX")),
  phone: zodPhoneNumber({
    optional: false,
    message: translateValidationErrors("INVALID_PHONE"),
  }),
  status: z
    .nativeEnum(USER_STATUS, {
      invalid_type_error: translateValidationErrors("STATUS_REQUIRED"),
    })
    .default(USER_STATUS.INACTIVE),
  type: z.nativeEnum(USER_TYPE, {
    invalid_type_error: translateValidationErrors("USER_TYPE_REQUIRED"),
  }),
  login_with_otp: z.boolean().optional().default(false),
  avatar: z.instanceof(File, {
    message: translateValidationErrors("AVATAR_REQUIRED"),
  }),
});

// ADD USER SCHEMA OBJECT TYPE
export type AddUserFormData = z.infer<typeof addUserSchema>;

// ADD USER FORM DATA HOOK
export default function useAddUserForm() {
  return useFormValidation<AddUserFormData>(addUserSchema);
}
