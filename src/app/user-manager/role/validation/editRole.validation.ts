import * as z from "zod";
import {
  ROLE_STATUS,
  ROLE_TYPE,
} from "../../../../shared/types/models/Role.model";
import useFormValidation from "../../../../shared/hooks/useFormValidation";

// EDIT ROLE SCHEMA OBJECT
const editRoleSchema = z.object({
  name: z.string().min(5, "NAME_TOO_SHORT").max(50, "NAME_TOO_LONG"),
  description: z.string().max(400, "DESCRIPTION_TOO_LONG").optional(),
  type: z.nativeEnum(ROLE_TYPE, {
    invalid_type_error: "ROLE_TYPE_REQUIRED",
    required_error: "ROLE_TYPE_REQUIRED",
  }),
  status: z.nativeEnum(ROLE_STATUS, {
    invalid_type_error: "STATUS_REQUIRED",
    required_error: "STATUS_REQUIRED",
  }),
});

// EDIT ROLE SCHEMA OBJECT TYPE
export type EditRoleFormData = z.infer<typeof editRoleSchema>;

// EDIT ROLE FORM DATA HOOK
export default function useEditRoleForm(defaultValues: EditRoleFormData) {
  return useFormValidation<EditRoleFormData>(editRoleSchema, defaultValues);
}
