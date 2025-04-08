import React, { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu';


const SelectDropdown = ({
    options, value, onChange, placeholder
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option)
        setIsOpen(false)
    }



    return (
        <div className='relative w-full'>
            {/* dropdown button */}
            <button className=''
                onClick={() => setIsOpen(!isOpen)}

            >
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className=''>
                    {isOpen ? <LuChevronDown className='' /> : <LuChevronDown />}
                </span>
            </button>
            {/* dropdown menu  */}

            {isOpen && (
                <div className=''>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className=''
                        >
                            {option.value}
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default SelectDropdown