// resources/js/pages/teams/joinTeam.tsx
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { dashboard } from '@/routes';
import Toast from '@/components/toast';

type PageProps = {
    flash: { success?: string; error?: string };
};

export default function JoinTeam() {
    const { flash } = usePage<PageProps>().props;

    const [code, setCode] = useState('');
    const [error, setError] = useState<string | undefined>();
    const [submitting, setSubmitting] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(undefined);

        router.post(
            '/teams/join',
            { invite_code: code.trim().toUpperCase() },
            {
                onError: (errs) => setError(errs.invite_code),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <>
            <Head title="Join Team" />

            {flash?.success && (
                <Toast message={flash.success} variant="success" />
            )}

            <div className="max-w-md mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Join a Team</h1>

                <form
                    onSubmit={submit}
                    className="space-y-5 border rounded-xl p-6 shadow"
                >
                    <div>
                        <label className="font-medium">Invite Code</label>
                        <input
                            className="w-full border rounded p-2 font-mono uppercase tracking-widest"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={8}
                            placeholder="ABCD1234"
                            required
                        />
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Joining…' : 'Join Team'}
                    </button>
                </form>
            </div>
        </>
    );
}

JoinTeam.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Join Team', href: '#' },
    ],
};