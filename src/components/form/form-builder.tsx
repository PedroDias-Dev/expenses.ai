import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Path } from "react-hook-form";
import { FormFieldConfig } from "@/types/form-field-config";

interface FormBuilderProps<T extends z.ZodType> {
  fields: FormFieldConfig[];
  schema: T;
  onSubmit: (values: z.infer<T>) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  defaultValues?: Partial<z.infer<T>>;
}

export function FormBuilder<T extends z.ZodType>({
  fields,
  schema,
  onSubmit,
  submitButtonText = "Submit",
  cancelButtonText,
  onCancel,
  defaultValues = {},
}: FormBuilderProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  type FormValues = z.infer<T>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormValues,
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const { name, label, type, placeholder, description, options } = field;

    // Type assertion to make TypeScript happy with dynamic field names
    const fieldName = name as Path<FormValues>;

    switch (type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    {...field}
                    value={(field.value as string) || ""}
                    onChange={(e) => {
                      if (type === "number") {
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        );
                      } else {
                        field.onChange(e.target.value);
                      }
                    }}
                  />
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "checkbox":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{label}</FormLabel>
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "select":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "textarea":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Textarea placeholder={placeholder} {...field} />
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        {fields.map(renderField)}

        <div className="w-full flex items-center justify-between mt-9">
          {cancelButtonText && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelButtonText}
            </Button>
          )}
          <div className={cancelButtonText && onCancel ? "" : "ml-auto"}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : submitButtonText}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
