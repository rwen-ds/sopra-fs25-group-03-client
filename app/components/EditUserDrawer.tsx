'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';

type Props = {
    user: User | null;
    open: boolean;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
};

export default function EditUserDrawer({ user, open, onClose, onSave }: Props) {
    const [formUser, setFormUser] = useState<User | null>(null);

    useEffect(() => {
        setFormUser(user);
    }, [user]);

    if (!open || !formUser) return null;

    return (
        <div className="drawer drawer-end drawer-open fixed inset-0 z-50">
            <input type="checkbox" className="drawer-toggle" checked readOnly />
            <div className="drawer-side">
                <label className="drawer-overlay" onClick={onClose}></label>
                <div className="menu p-6 w-[400px] min-h-full bg-base-200 text-base-content shadow-lg">
                    <h2 className="text-xl font-bold text-center mb-4">Edit User</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSave(formUser);
                            onClose();
                        }}
                        className="space-y-4"
                    >
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="input input-bordered w-full"
                            value={formUser.username || ""}
                            onChange={(e) => setFormUser({ ...formUser, username: e.target.value })}
                        />

                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input input-bordered w-full"
                            value={formUser.email || ""}
                            onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                        />

                        <label className="label">
                            <span className="label-text">Birthday</span>
                        </label>
                        <input
                            type="date"
                            name="birthday"
                            className="input input-bordered w-full"
                            value={formUser.birthday || ""}
                            onChange={(e) => setFormUser({ ...formUser, birthday: e.target.value })}
                        />

                        <label className="label">
                            <span className="label-text">Language</span>
                        </label>
                        <select
                            name="language"
                            className="select select-bordered w-full"
                            value={formUser.language || ""}
                            onChange={(e) => setFormUser({ ...formUser, language: e.target.value })}
                        >
                            <option value="">Select a language</option>
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">Français</option>
                            <option value="it">Italiano</option>
                            <option value="zh">中文</option>
                            <option value="es">Español</option>
                            <option value="ja">日本語</option>
                            <option value="ko">한국어</option>
                        </select>

                        <label className="label">
                            <span className="label-text">Gender</span>
                        </label>
                        <select
                            name="gender"
                            className="select select-bordered w-full"
                            value={formUser.gender || ""}
                            onChange={(e) => setFormUser({ ...formUser, gender: e.target.value })}
                        >
                            <option value="">Select gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>


                        <div className="flex justify-center gap-2 mt-13">
                            <button type="submit" className="btn btn-neutral flex-1">
                                Save
                            </button>
                            <button type="button" className="btn btn-outline flex-1" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
