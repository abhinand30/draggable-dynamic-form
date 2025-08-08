
interface FormFieldOption {
    value: string;
    optionId: string;
}

interface FormField {
    formId: string;
    type: string;
    label: string;
    options?: FormFieldOption[];
    width?: number|string
}

interface FormData {
    formFields: FormField[];
    title:string;
}

type DynamicFormType = {
    [key: string]: FormData;
};
type ErrorType = {
    [key: string]: string;
}

type validationCheckType= { 
    validation: 'option' | 'accordion' | 'field'|'all'; 
    dynamicForm: DynamicFormType; 
    item?: FormField, accordionId?: string 
}
export type { DynamicFormType, FormData, FormField, FormFieldOption,ErrorType,validationCheckType }
