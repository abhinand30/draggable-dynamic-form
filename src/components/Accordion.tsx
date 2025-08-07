import React, { type ReactNode } from 'react'

type AccordionType = {
    children: ReactNode;
    accordionId: string;
    handleClick: (value: string) => void;
    activeAccordion: string;
}
const Accordion: React.FC<AccordionType> = ({ children, accordionId, handleClick, activeAccordion }) => {
   
    return (
        <div id="accordion-open" data-accordion="open">
            <h2 id="accordion-open-heading-1" onClick={() => handleClick(accordionId)}>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border gap-3"
                    data-accordion-target="#accordion-open-body-1"
                    aria-expanded="true"
                    aria-controls="accordion-open-body-1"
                >
                    <span className="flex items-center">
                        {accordionId}
                    </span>
                    <svg data-accordion-icon="" className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5 5 1 1 5" />
                    </svg>
                </button>
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
