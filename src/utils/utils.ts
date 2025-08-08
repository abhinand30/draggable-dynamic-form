import type { validationCheckType, ErrorType, DynamicFormType } from "./types";

export const generateUniqueId = () => {
    return Date.now().toString();
};

export const checkValidation = ({ validation, dynamicForm, item, accordionId }: validationCheckType) => {
    const newError: ErrorType = {}
    switch (validation) {
        case 'option': {
            const targetField = dynamicForm[accordionId!]?.formFields.find((form) => form.formId === item?.formId);
            targetField?.options?.forEach((option) => {
                if (!option.value?.trim()) {
                    newError[option.optionId] = 'Option is required';
                }
            });
            break;
        }

        case 'accordion': {
            Object.entries(dynamicForm).forEach(([id, accordion]) => {
                if (accordion.formFields.length === 0) {
                    newError[id] = 'Accordion must contain at least one field';
                }
            });
            break;
        }

        case 'field':
        default: {
            dynamicForm[accordionId!]?.formFields.forEach((form) => {
                if (!form.label?.trim()) {
                    newError[form.formId] = 'Label is required';
                }
            });

            break;
        }
    }

    return newError;
};

export const checkAllValidation = (dynamicForm: DynamicFormType) => {
    const newError: ErrorType = {}
    Object.entries(dynamicForm).forEach(([id, accordion]) => {
        // check accordion
         if(accordion.title===''){
             newError[id] = 'Accordion name is required';
        }else if(accordion.formFields.length === 0) {
            newError[id] = 'Accordion must contain at least one field';
        }
        accordion.formFields.forEach((form) => {
            // Check label
            if (!form.label?.trim()) {
                newError[form.formId] = 'Label is required';
            }
            // Check options
            if (form.options?.length) {
                form.options.forEach((option) => {
                    if (!option.value?.trim()) {
                        newError[option.optionId] = 'Option is required';
                    }
                });
            }
        });
    });

    return newError
}
