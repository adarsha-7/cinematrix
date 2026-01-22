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
                                className={({ active, selected }) =>
                                    `cursor-pointer px-5 py-2 transition ${
                                        active ? 'bg-gray-800' : selected ? 'bg-gray-800 text-white' : 'text-gray-200'
                                    }`
                                }
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
