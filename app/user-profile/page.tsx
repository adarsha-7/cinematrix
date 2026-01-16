'use client';

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';

type User = {
    name: string;
    email: string;
    image?: string;
};

export default function UserProfilePage() {
    const router = useRouter();
    const { session, loading, error, refetch } = useAuth();

    useEffect(() => {
        if (!loading && !session?.user) {
            router.push('/home');
        }
    }, [session, loading, router]);

    const [user, setUser] = useState<User | null>(session?.user || null);
    const [newName, setNewName] = useState(user?.name || '');
    const [newImage, setNewImage] = useState<File | null>(null);
    const [userInfoChanged, setUserInfoChanged] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setUser(session?.user || null);
        setNewName(session?.user?.name || '');
        setNewImage(null);
        setUserInfoChanged(false);
    }, [session]);

    useEffect(() => {
        setUserInfoChanged(user?.name !== newName || !!newImage);
    }, [newName, newImage, user]);

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    const handleSaveChanges = async () => {
        if (!user) return;

        const formData = new FormData();
        formData.append('name', newName);
        if (newImage) formData.append('image', newImage);

        try {
            ///////
            console.log('Saving changes:', formData);

            setNewImage(null);
            setUserInfoChanged(false);
        } catch (err) {
            console.error('Failed to save changes', err);
        }
    };

    return (
        <div>
            <div className="fixed top-0 left-0 z-50 w-full bg-black">
                <Navbar />
            </div>

            <main className="mx-auto mt-24 max-w-4xl px-6 py-16">
                <h1 className="mb-8 text-center text-3xl font-bold">User Profile</h1>

                <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-gray-400/40 bg-[#111] p-8">
                    <img
                        src={
                            newImage
                                ? URL.createObjectURL(newImage)
                                : user?.image ||
                                  'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg'
                        }
                        alt="User Avatar"
                        className="h-32 w-32 rounded-full border-2 border-neutral-700 object-cover"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700"
                    >
                        <Upload size={16} />
                        Upload New
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    <div className="mt-4 w-full text-center">
                        <label className="mb-2 block text-sm text-gray-400">Name</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={handleNameChange}
                            className="w-full rounded-xl border border-gray-500/30 px-4 py-2 text-center text-white focus:ring-1 focus:ring-neutral-600 focus:outline-none"
                        />
                    </div>

                    <div className="w-full text-center">
                        <label className="mb-2 block text-sm text-gray-400">Email</label>
                        <p className="rounded-xl border border-gray-500/30 px-4 py-2 text-white">{user?.email || ''}</p>
                    </div>

                    {userInfoChanged && (
                        <button
                            onClick={handleSaveChanges}
                            className="bg-primary hover:bg-primary-hover mt-6 w-full rounded-xl px-6 py-3 text-white"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
