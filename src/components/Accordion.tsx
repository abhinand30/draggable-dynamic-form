import React, { type ReactNode } from 'react'
import type { DynamicFormType } from '../utils/types';
type ErrorType = {
    [key: string]: string;
}
type AccordionType = {
    children: ReactNode;
    accordionId: string;
    handleClick: (value: string) => void;
    activeAccordion: string;
    dynamicForm?:DynamicFormType;
    handleChange?:any;
    accordionName?:string;
    errors?:ErrorType
}
const Accordion: React.FC<AccordionType> = ({ children, accordionId, handleClick, activeAccordion,handleChange,dynamicForm,accordionName,errors }) => {
   
    return (
        <div id="accordion-open" data-accordion="open">
            <h2 id="accordion-open-heading-1" onClick={() => handleClick(accordionId)}>
                <div
                    
                    className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border gap-3"
                    data-accordion-target="#accordion-open-body-1"
                    aria-expanded="true"
                    aria-controls="accordion-open-body-1"
                >
                    <div className="" >
                       <p>{dynamicForm?<input name={dynamicForm[accordionId].title} value={dynamicForm[accordionId].title} onChange={(e)=>handleChange({ e,isTitle:true,  accordionId: accordionId })} placeholder='Enter Accordion Name'/>:
                       accordionName}</p>
                        <p className='text-red-500 text-md'>{errors&&errors[accordionId]}</p>
                    </div>
                       
                    <svg data-accordion-icon="" className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5 5 1 1 5" />
                    </svg>
                </div>
            </h2>
            <div
                id="accordion-open-body-1"
                className={accordionId === activeAccordion ? 'block border-b-1' : "hidden"}
                aria-labelledby="accordion-open-heading-1"
            >
                {children}
            </div>
        </div>

    )
}

export default Accordion
