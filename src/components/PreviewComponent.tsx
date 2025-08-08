import React, { useState } from 'react'
import Accordion from './Accordion'
import type { DynamicFormType, FormField } from '../utils/types';


interface PreviewComponentProps {
    dynamicForm: DynamicFormType; // Now accepts DynamicFormType
}
const PreviewComponent: React.FC<PreviewComponentProps> = ({ dynamicForm }) => {
    const [activeAccordion, setActiveAccordion] = useState("");

    const handleAccordionToggle = (id: string) => setActiveAccordion(prev => (prev === id ? '' : id));

    const renderForm = (form: FormField) => {
        switch (form.type) {
            case 'text':
            case 'file':
            case 'date':
                return (<input type={form.type} className='border-1 p-1 ' />)
            case 'select':
                return (<>
                    <select title={form.label} className='border-1 p-1 '>
                        <option>Select {form.label}</option>
                        {form.options && form.options.map((option, index) => (
                            <option key={index}>{option.value}</option>
                        ))}
                    </select>

                </>)
            case 'radio':
            case 'checkbox':
                return (<>
                    {form.options && form.options.map((option, index) => (
                        <div className='gap-4' key={index}>
                            <input type='radio' value={option.value} name={option.value} />
                            <label>{option.value}</label>
                        </div>
                    ))}
                </>)
            case 'textArea':
                return (
                    <textarea placeholder={form.label} className='border-1 p-1' />
                )
        }
    }
    return (
        <div
            className='w-10/12 border-1 mt-6 p-4'
        >
            {Object.keys(dynamicForm).map((accordionId) => (
                <Accordion accordionId={accordionId} key={accordionId} handleClick={handleAccordionToggle} activeAccordion={activeAccordion} accordionName={dynamicForm[accordionId].title}>
                    <div
                        className="grid grid-cols-12 p-4 gap-4 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-50"
                    >
                        {dynamicForm[accordionId as keyof typeof dynamicForm].formFields.map((form, index: number) => (
                            <div key={index}
                                className={`col-span-dynamic-${String(form.width || 3)}`}
                            >
                                <div key={index}
                                    className={`flex flex-col`}
                                >
                                    <label>{form.label}</label>
                                    {renderForm(form)}
                                </div>
                            </div>
                        ))}
                    </div>
                </Accordion>
            ))}
        </div>
    )
}

export default PreviewComponent