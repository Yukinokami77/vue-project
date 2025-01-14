import { ref, computed, reactive } from "vue";

type ValidationRule = (value: any) => string | null;

interface FieldConfig {
  value: any;
  rules: ValidationRule[];
}

type FormConfig = Record<string, FieldConfig>;

export function useFormValidator(formConfig: FormConfig) {
  const formState = reactive(
    Object.fromEntries(
      Object.entries(formConfig).map(([field, config]) => [
        field,
        {
          value: config.value,
          errors: [] as string[],
        },
      ])
    )
  );

  const validateField = (field: string) => {
    const config = formConfig[field];
    const fieldState = formState[field];
    fieldState.errors = config.rules
      .map((rule) => rule(fieldState.value))
      .filter((error) => error !== null) as string[];
  };

  const validateForm = () => {
    Object.keys(formConfig).forEach(validateField);
  };

  const isFormValid = computed(() =>
    Object.values(formState).every((field) => field.errors.length === 0)
  );

  const validateOnChange = (field: string) => {
    validateField(field);
  };

  return {
    formState,
    validateField,
    validateForm,
    isFormValid,
    validateOnChange,
  };
}
