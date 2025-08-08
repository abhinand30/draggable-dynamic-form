import React, { useState } from 'react'

import Accordion from '../components/Accordion';
import PreviewComponent from '../components/PreviewComponent';
import type { DynamicFormType, FormField } from '../utils/types';
import { checkAllValidation, checkValidation, generateUniqueId } from '../utils/utils';
import deleteIcon from '../assets/deleteIcon.png';
import DropDown from '../components/DropDown';

// constants
const formElements = ['accordion', 'text', 'textArea', 'file', 'date', 'select', 'radio', 'checkbox'];
const multiOptionFormArray = ['select', 'radio', 'checkbox'];
const customWidth = [3, 4, 6, 12];

type OnChangeType = {
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
    item?: FormField;
    accordionId: string;
    isOption?: boolean;
    isWidth?: boolean;
    isTitle?: boolean;
}
type ErrorType = {
    [key: string]: string;
}
type VisibleWidthType = {
    [key: string]: boolean;
}

const DynamicForm = () => {
    const [dynamicForm, setDynamicForm] = useState<DynamicFormType>({});
    const [targetedItem, setTargetedItem] = useState<string>('');
    const [activeAccordion, setActiveAccordion] = useState("");
    const [errors, setErrors] = useState<ErrorType>({});
    const [preview, setPreview] = useState<boolean>(false);
    const [draggedAccordion, setDraggedAccordion] = useState<string | null>(null)
    const [dragField, setDragField] = useState<{ accordionId: string, fromIndex: number } | null>(null);
    const [selectOption, setSelectOption] = useState<string>('');
    const [visibleWidthSelector, setVisibleWidthSelector] = useState<VisibleWidthType>({});


    // Accordion Toggle
    const handleAccordionToggle = (id: string) => setActiveAccordion(prev => (prev === id ? '' : id));

    // Drag Handlers
    const onDragStart = ({ formType, accordionId }: { formType?: string; accordionId?: string }) => {
        formType ? setTargetedItem(formType) : accordionId && setDraggedAccordion(accordionId);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const onDragFields = ({ accordionId, fromIndex }: any) => {
        setDragField({ accordionId, fromIndex })
    }

    const handleFieldDrop = (dropIndex: number) => {
        if (!dragField || dropIndex === undefined) return;
        const current = { ...dynamicForm };
        const moved = current[dragField.accordionId].formFields.splice(dragField.fromIndex, 1)[0];
        current[dragField.accordionId].formFields.splice(dropIndex, 0, moved);
        setDynamicForm(current);
    };


    const handleDrop = ({ accordionId, dropIndex }: { accordionId?: string; dropIndex?: number }) => {
        if (draggedAccordion && dropIndex !== undefined) {
            const entries = Object.entries(dynamicForm); //convert array of string key value pairs
            const fromIndex = entries.findIndex(([key]) => key === draggedAccordion);
            const [movedEntry] = entries.splice(fromIndex, 1); //
            entries.splice(dropIndex, 0, movedEntry);
            const reorderedForm = Object.fromEntries(entries);
            setDynamicForm(reorderedForm);
            setDraggedAccordion('');
            return
        }
        else {
            const newId = generateUniqueId();
            // chacking null fields
            const fieldErrors = checkValidation({ validation: 'field', dynamicForm, accordionId });
            if (Object.keys(fieldErrors).length > 0) return setErrors(fieldErrors);
            switch (targetedItem) {
                case 'accordion':
                    const accordionErrors = checkValidation({ validation: 'accordion', dynamicForm });
                    if (Object.keys(accordionErrors).length > 0) return alert('accordion Field is null')
                    const title = 'accordion' + Object.keys(dynamicForm).length;
                    return setDynamicForm((prev) => ({ ...prev, [title]: { title: '', formFields: [] } }))
                case 'text':
                case 'date':
                case 'file':
                case 'textArea':
                    return accordionId && setDynamicForm((prev) => ({ ...prev, [accordionId]: { title: prev[accordionId].title, formFields: [...(prev[accordionId]?.formFields), { formId: newId, type: targetedItem, label: '', }] } }));
                case 'select':
                case 'radio':
                case 'checkbox':
                    return accordionId && setDynamicForm((prev) => ({ ...prev, [accordionId]: { title: prev[accordionId].title, formFields: [...(prev[accordionId]?.formFields), { formId: newId, type: targetedItem, label: '', options: [] }] } }));
            }
        }
    }
    
    const handleDropDown = (formId: string) => {
        setSelectOption(formId);

    }
    const handlePreview = () => {
        const newErrors = checkAllValidation(dynamicForm);
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return alert('Some Fields are empty')
        setPreview(!preview)
    }
   
    // input Change
    const handleChange = ({ e, item, accordionId, isOption, isWidth, isTitle }: OnChangeType) => {
        const { value, id } = e.target;

        setErrors(prev => ({ ...prev, [id]: '' }));
        if (isWidth) setVisibleWidthSelector((prev) => ({ ...prev, [id]: false }))
        setDynamicForm(prev => {
            const currentAccordion = prev[accordionId];
            if (!currentAccordion) return prev;
            if (isTitle) {
                return { ...prev, [accordionId]: { ...currentAccordion, title: value } }
            }
            const updatedFields = currentAccordion?.formFields.map(form => {
                if (form.formId !== (item && item.formId)) return form;
                if (isOption) {
                    return { ...form, options: form.options?.map(opt => String(opt.optionId) === id ? { ...opt, value } : opt) };
                } else if (isWidth) {
                    return { ...form, width: Number(value) || '' };
                } else {
                    return { ...form, label: value };
                }
            });
            return { ...prev, [accordionId]: { ...currentAccordion, formFields: updatedFields, }, };
        });
    };



    const handleAddSelectOptions = (item: FormField, accordionId: string) => {
        const newId = generateUniqueId();
        const newError = checkValidation({ validation: 'option', dynamicForm, item, accordionId })
        if (Object.keys(newError).length > 0) return setErrors(newError);
        setDynamicForm((prev) => ({
            ...prev, [accordionId]: {
                title: prev[accordionId].title,
                formFields: prev[accordionId]?.formFields.map((form) => form.formId === item.formId ?
                    { ...form, options: [...(form.options ?? []), { optionId: newId, value: '' }] } : form)
            }
        }))
    };


    const handleDeleteField = (formId: string, accordionId: string, optionId?: string) => {
        setDynamicForm((prev) =>
        ({
            ...prev, [accordionId]: {
                title: prev[accordionId].title,
                formFields:
                    optionId ?
                        prev[accordionId]?.formFields.map((form) => form.formId === formId ? { ...form, options: form.options?.filter((opt) => opt.optionId !== optionId) } : form)
                        :
                        prev[accordionId]?.formFields.filter((form) => form.formId !== formId) //option deleting
            }
        }))
    }

     const handleAddCustomWidth = (accordionId: string, formId: string) => {
        const alreadyAdded=Object.keys(visibleWidthSelector).includes(formId)
        if (!alreadyAdded) {
            setDynamicForm((prev) => ({
                ...prev, [accordionId]: {
                    title: prev[accordionId].title,
                    formFields: prev[accordionId]?.formFields.map((form) =>
                        form.formId == formId ? { ...form, width: 3 } : form)
                }}))
        }
        return setVisibleWidthSelector((prev) => ({ ...prev, [formId]: true }))
    }


    return (
        <div>
            <div className='w-[90%]  border-1'>
                <div className='w-[100%] flex p-4 self-center items-center mt-2 min-h-[500px] h-auto gap-6'>
                    <div className='flex flex-col gap-6'>
                        {formElements.map((item) => (
                            <button
                                key={item}
                                className='bg-blue-300 p-3 w-[200px] text-white rounded-sm'
                                draggable={true}
                                onDragStart={() => onDragStart({ formType: item })}>
                                {item}
                            </button>
                        ))}
                    </div>
                    <div className='min-w-10/12 min-h-[400px] h-auto border-1 p-2 rounded-sm overflow-y-scroll' onDragOver={handleDragOver} onDrop={() => handleDrop({})}>
                        {Object.keys(dynamicForm).map((key, index) => (
                            // Drag Accordion
                            <div
                                key={index}
                                draggable
                                onDragStart={() => onDragStart({ accordionId: key })}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop({ dropIndex: index, accordionId: key })}
                            >
                                <Accordion
                                    accordionId={key}
                                    handleClick={handleAccordionToggle}
                                    activeAccordion={activeAccordion}
                                    handleChange={handleChange}
                                    dynamicForm={dynamicForm}
                                    errors={errors}

                                >
                                    <div className="grid grid-cols-12 p-4 gap-4 border border-b-0">

                                        {/* Dragged Form Fields */}
                                        {dynamicForm[key].formFields.map((item, index) => (
                                            <div key={index} className={`col-span-dynamic-${String(item.width || 3)} gap-2 mb-2`}
                                                draggable
                                                onDragStart={() => onDragFields({ accordionId: key, fromIndex: index })}
                                                onDrop={() => handleFieldDrop(index)}
                                            >
                                                {/* For label Name chnage */}
                                                <input className="block text-sm font-medium text-gray-900"
                                                    id={item.formId}
                                                    value={item.label}
                                                    placeholder='Enter Label'
                                                    onChange={(e) => handleChange({ e, item, accordionId: key })}
                                                />
                                                <div className='flex'>
                                                    <div className={`border-1 p-1 w-full bg-gray-200`}>{item.type}</div >
                                                    {/* Drop Down */}
                                                    <DropDown onClick={handleDropDown} formId={item.formId} selectOption={selectOption} >
                                                        <ul className="px-2 py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                                            <li className='text-black py-1 mb-2 border-b-1 border-gray-100' onClick={() => handleDeleteField(item.formId, key)}>Delete Field</li>
                                                            {multiOptionFormArray.includes(item.type) && (
                                                                <li className='text-black border-b-1 border-gray-100  mb-2' onClick={() => handleAddSelectOptions(item, key)}>Add Option</li>
                                                            )}
                                                            <li className='text-black border-gray-100 mb-1' onClick={() => handleAddCustomWidth(key, item.formId)}>Add Width</li>
                                                        </ul>
                                                    </DropDown>
                                                </div>
                                                <p className='text-red-500'>{errors[item.formId]}</p>
                                                <div className='gap-2' >
                                                    {/* add custom width */}
                                                    {item.width !== undefined && visibleWidthSelector[item.formId] && (
                                                        <div>
                                                            <p>width</p>
                                                            <select className='p-1 border-1'
                                                                id={item.formId}
                                                                value={item.width}
                                                                onChange={(e) => handleChange({ e, item, accordionId: key, isWidth: true })}>
                                                                <option>width</option>
                                                                {customWidth.map((item, index) => (
                                                                    <option value={item} key={index}>{item}</option>

                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                    {/* Render options */}
                                                    {multiOptionFormArray.includes(item.type) && item.options?.map(opt => (
                                                        <div className="flex mt-2" key={opt.optionId}>
                                                            <input className="border p-1 text-black"
                                                                id={String(opt.optionId)}
                                                                value={opt.value}
                                                                placeholder="Option"
                                                                onChange={e => handleChange({ e, item, accordionId: key, isOption: true })}
                                                            />
                                                            <button onClick={() => handleDeleteField(item.formId, key, opt.optionId)}>
                                                                <img src={deleteIcon} alt="delete" className="size-6" />
                                                            </button>
                                                            <p className="text-red-500">{errors[opt.optionId]}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Accordion>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='m-6 gap-6 justify-end flex'>
                    <button className='bg-red-400 px-2 py-1 btn' onClick={()=>setDynamicForm({})}>Clear</button>
                    <button className='bg-black px-2 py-1 btn' onClick={handlePreview}>Preview</button>
                </div>
            </div>
            {preview && (
                <PreviewComponent dynamicForm={dynamicForm} />
            )}

        </div>
    )
}

export default DynamicForm