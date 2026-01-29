import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ListChevronsUpDown } from 'lucide-react';
import type { selectProps } from '../types';

export default function Select({ options, selectedOption, setSelectedOption }: selectProps) {
    const capitalize = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

    return (
        <div className="mt-6 w-44">
            <Listbox value={selectedOption} onChange={setSelectedOption}>
                <div className="relative">
                    {/* Button */}
                    <ListboxButton
                        className={`hover:border-primary flex w-full cursor-pointer justify-between rounded-xl border-2 border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 transition`}
                    >
                        {capitalize(selectedOption)}
                        <ListChevronsUpDown className="h-5 w-5" />
                    </ListboxButton>

                    {/* Options */}
                    <ListboxOptions className="bg-background absolute mt-1 max-h-60 w-full overflow-auto rounded-xl border-2 border-gray-800 py-2 text-sm focus:outline-none">
                        {options.map((option) => (
                            <ListboxOption
                                key={option}
                                value={option}
                                className="group data-focus:bg-primary relative cursor-default py-2 pr-9 pl-3 text-white select-none data-focus:outline-hidden"
                            >
                                {capitalize(option)}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );
}
