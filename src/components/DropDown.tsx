import  { useState, useRef, useEffect } from 'react'

const DropDown = ({ onClick, formId, children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    onClick(formId);
  };

  return (
    <div ref={dropdownRef} className="relative ">
      <button
        id="dropdownDefaultButton"
        className="text-black size-6 "
        type="button"
        onClick={toggleDropdown}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
        </svg>
      </button>
      {/* dropdown menu */}
      <div
        id="dropdown"
         onClick={toggleDropdown}
        className={`${isOpen ? 'block' : 'hidden'} absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-200`}
      >
        {children}
      </div>
    </div>
  )
}

export default DropDown