import {
  Autocomplete,
  Box,
  DialogContent,
  FormControlLabel,
  Grid,
  Switch,
} from "@mui/material";
import i18next from "i18next";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import LoadingButton from "../../../../../shared/components/Buttons/LoadingButton";
import DialogContainer from "../../../../../shared/components/Dialogs/DialogParts/DialogContainer";
import DialogFooter from "../../../../../shared/components/Dialogs/DialogParts/DialogFooter";
import FormInput from "../../../../../shared/components/Inputs/FormInput";
import { translateValidationErrors } from "../../../../../shared/helpers/factory";
import { formatToRegularString } from "../../../../../shared/helpers/formats";
import {
  ROLE_STATUS,
  ROLE_TYPE,
  RoleModel,
} from "../../../../../shared/types/models/Role.model";
import useEditRole from "../../services/editOne";
import useEditRoleForm, {
  EditRoleFormData,
} from "../../validation/editRole.validation";

interface EditRoleProps {
  open: boolean;
  onClose: () => void;
  selectedRowId: number;
  formState: RoleModel;
}

const EditRole = ({
  onClose,
  open,
  selectedRowId,
  formState,
}: EditRoleProps) => {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isDirty },
    reset,
  } = useEditRoleForm(formState!);

  const { mutate, isPending } = useEditRole(selectedRowId, setError);

  const onSubmit = (data: EditRoleFormData) => {
    mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  // Reset the form with new formState whenever it changes
  useEffect(() => {
    reset(formState);
  }, [formState, reset]);

  return (
    <DialogContainer
      open={open}
      onClose={onClose}
      head={i18next.t("Edit_ROLE")}
      scroll={"paper"}
    >
      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          id="myForm"
        >
          <Grid
            container
            columnSpacing={3}
            rowSpacing={2}
            id="scroll-dialog-description"
            ref={null}
            tabIndex={-1}
          >
            {/* name */}
            <Grid item xs={12} md={6}>
              <FormInput
                inputProps={{
                  ...register("name"),
                }}
                error={!!errors.name}
                helperText={translateValidationErrors(errors.name?.message)}
                labelKey={i18next.t("name")}
                placeholder={i18next.t("name")}
                name="name"
                type="name"
                variant="outlined"
                fullWidth
                isRequired
              />
            </Grid>
            {/* type */}
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="type"
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => {
                  return (
                    <Autocomplete
                      onChange={(_, selectedValue) => onChange(selectedValue)}
                      value={value || null}
                      options={Object.values(ROLE_TYPE)}
                      getOptionLabel={(option) => formatToRegularString(option)}
                      renderInput={(params) => (
                        <FormInput
                          {...params}
                          labelKey={i18next.t("type")}
                          placeholder={i18next.t("type")}
                          isRequired
                          error={invalid}
                          helperText={translateValidationErrors(error?.message)}
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>
            {/* description */}
            <Grid item xs={12}>
              <FormInput
                inputProps={{
                  ...register("description"),
                }}
                error={!!errors.description}
                helperText={translateValidationErrors(
                  errors.description?.message,
                )}
                labelKey={i18next.t("description")}
                placeholder={i18next.t("description")}
                name="description"
                type="text"
                variant="outlined"
                fullWidth
              />
            </Grid>
            {/* status */}
            <Grid item xs={12} className="flex flex-row gap-2">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label={i18next.t("status")}
                    control={
                      <Switch
                        {...field}
                        checked={field.value === ROLE_STATUS.ACTIVE}
                        color="success"
                        onChange={(e) =>
                          field.onChange(
                            e.target.checked
                              ? ROLE_STATUS.ACTIVE
                              : ROLE_STATUS.INACTIVE,
                          )
                        }
                      />
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogFooter onClose={onClose}>
        <LoadingButton
          type="submit"
          form="myForm"
          label={i18next.t("SAVE")}
          isLoading={isPending}
          fullWidth={false}
          disabled={isPending || !isDirty}
        />
      </DialogFooter>
    </DialogContainer>
  );
};

export default EditRole;
