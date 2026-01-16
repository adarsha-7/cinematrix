'use client';

import { useState, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function UserProfilePage() {
    const originalUser = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        image: 'https://placehold.co/200x200',
    };

    const [user, setUser] = useState(originalUser);

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser((prev) => ({ ...prev, name: e.target.value }));
    };

    const handleSaveChanges = () => {
        console.log('Saved:', user);
        // Update originalUser to match new saved name
        // (simulate API save)
        // In this example, we just update the reference in state
        originalUser.name = user.name;
    };

    const isNameEdited = user.name !== originalUser.name;

    return (
        <div className="">
            <div className="fixed top-0 left-0 z-50 w-full bg-black">
                <Navbar />
            </div>

            <main className="mx-auto mt-24 max-w-4xl px-6 py-16">
                <h1 className="mb-8 text-center text-3xl font-bold">User Profile</h1>

                <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-gray-400/40 bg-[#111] p-8">
                    <img
                        src={user.image}
                        alt="User Avatar"
                        className="h-32 w-32 rounded-full border-2 border-neutral-700 object-cover"
                    />

                    <button className="flex cursor-pointer items-center gap-2 rounded-lg border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700">
                        <Upload size={16} />
                        Upload New
                    </button>

                    <div className="mt-4 w-full text-center">
                        <label className="mb-2 block text-sm text-gray-400">Name</label>
                        <input
                            type="text"
                            value={user.name}
                            onChange={handleNameChange}
                            className="w-full rounded-xl border border-gray-500/30 px-4 py-2 text-center text-white focus:ring-1 focus:ring-neutral-600 focus:outline-none"
                        />
                    </div>

                    <div className="w-full text-center">
                        <label className="mb-2 block text-sm text-gray-400">Email</label>
                        <p className="rounded-xl border border-gray-500/30 px-4 py-2 text-white">{user.email}</p>
                    </div>

                    {/* Save Changes Button */}
                    {isNameEdited && (
                        <button
                            onClick={handleSaveChanges}
                            className="mt-6 w-full rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
