import { router } from '@inertiajs/react';
import { useState } from 'react';

type SportType = {
    id: number;
    name: string;
    is_team_based: boolean;
    active_players: number;
    min_players: number;
    max_players: number;
};

export type TournamentFormData = {
    id: number;
    name: string;
    description: string | null;
    sport_type_id: number;
    visibility: 'public' | 'private';
    max_participants: number | null;
    start_date: string;
    end_date: string;
    status: string;
    banner: string | null;
};

type TournamentFormErrors = Partial<
    Record<
        'name' | 'description' | 'sport_type_id' | 'visibility' | 'start_date' | 'end_date' | 'banner' | 'max_participants',
        string
    >
>;

type TournamentFormProps = {
    /** Pass an existing tournament to switch into edit mode. Omit for create. */
    tournament?: TournamentFormData;
    sportTypes: SportType[];
    flashSuccess?: string;
};

export function TournamentForm({ tournament, sportTypes, flashSuccess }: TournamentFormProps) {
    const isEditMode = !!tournament;

    const [errors, setErrors] = useState<TournamentFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        sport_type_id: tournament ? String(tournament.sport_type_id) : '',
        name: tournament?.name ?? '',
        description: tournament?.description ?? '',
        visibility: tournament?.visibility ?? 'public',
        start_date: tournament?.start_date ? tournament.start_date.slice(0, 10) : '',
        end_date: tournament?.end_date ? tournament.end_date.slice(0, 10) : '',
        banner: null as File | null,
        max_participants: tournament?.max_participants ? String(tournament.max_participants) : '',
    });

    const selectedSport =
        sportTypes.find((s) => String(s.id) === form.sport_type_id) ?? null;

    const updateField = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const url = isEditMode ? `/tournaments/${tournament!.id}` : '/tournaments';
        const options = {
            forceFormData: true,
            onError: (errs: any) => setErrors(errs as TournamentFormErrors),
            onFinish: () => setSubmitting(false),
        };

        if (isEditMode) {
            router.post(url, { ...form, _method: 'patch' }, options);
        } else {
            router.post(url, form, options);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Edit Tournament' : 'Create Tournament'}
            </h1>

            <form onSubmit={submit} className="space-y-5 border rounded-xl p-6 shadow">
                {/* Name */}
                <div>
                    <label className="font-medium">Tournament Name</label>
                    <input
                        className="w-full border rounded p-2"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        required
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="font-medium">Description</label>
                    <textarea
                        className="w-full border rounded p-2"
                        rows={4}
                        value={form.description}
                        onChange={(e) => updateField('description', e.target.value)}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                    )}
                </div>

                {/* Banner */}
                <div>
                    <label className="font-medium">Banner Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full border rounded p-2"
                        onChange={(e) => updateField('banner', e.target.files?.[0] ?? null)}
                    />
                    {tournament?.banner && !form.banner && (
                        <p className="text-xs text-gray-500 mt-1">
                            Current banner will be kept unless you upload a new one.
                        </p>
                    )}
                    {errors.banner && <p className="text-sm text-red-600 mt-1">{errors.banner}</p>}
                </div>

                {/* Sport */}
                <div>
                    <label className="font-medium">Sport Type</label>
                    <select
                        className="w-full border rounded p-2"
                        value={form.sport_type_id}
                        onChange={(e) => updateField('sport_type_id', e.target.value)}
                        required
                    >
                        <option value="">Select sport</option>
                        {sportTypes.map((sport) => (
                            <option key={sport.id} value={sport.id}>
                                {sport.name}
                            </option>
                        ))}
                    </select>
                    {errors.sport_type_id && (
                        <p className="text-sm text-red-600 mt-1">{errors.sport_type_id}</p>
                    )}
                </div>

                {/* Sport info (read-only preview, derived from selected sport) */}
                {selectedSport && (
                    <div className="rounded p-4 bg-muted/50 text-sm space-y-1">
                        <p>Type: {selectedSport.is_team_based ? 'Team' : 'Individual'}</p>
                        {selectedSport.is_team_based && (
                            <>
                                <p>Players on field: {selectedSport.active_players}</p>
                                <p>
                                    Squad size: {selectedSport.min_players} – {selectedSport.max_players}
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* Visibility */}
                <div>
                    <label className="font-medium">Visibility</label>
                    <select
                        className="w-full border rounded p-2"
                        value={form.visibility}
                        onChange={(e) => updateField('visibility', e.target.value)}
                        required
                    >
                        <option value="public">Public — anyone can view and register</option>
                        <option value="private">Private — invite only</option>
                    </select>
                    {errors.visibility && (
                        <p className="text-sm text-red-600 mt-1">{errors.visibility}</p>
                    )}
                </div>

                {/* Max participants */}
                <div>
                    <label className="font-medium">
                        Max {selectedSport?.is_team_based ? 'Teams' : 'Participants'}
                    </label>
                    <input
                        type="number"
                        min={2}
                        placeholder="Leave blank for no limit"
                        className="w-full border rounded p-2"
                        value={form.max_participants}
                        onChange={(e) => updateField('max_participants', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Optional. Leave blank to accept unlimited registrations.
                    </p>
                    {errors.max_participants && (
                        <p className="text-sm text-red-600 mt-1">{errors.max_participants}</p>
                    )}
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium text-sm">Start Date</label>
                        <input
                            type="date"
                            className="w-full border rounded p-2"
                            value={form.start_date}
                            onChange={(e) => updateField('start_date', e.target.value)}
                            required
                        />
                        {errors.start_date && (
                            <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-medium text-sm">End Date</label>
                        <input
                            type="date"
                            className="w-full border rounded p-2"
                            value={form.end_date}
                            onChange={(e) => updateField('end_date', e.target.value)}
                            required
                        />
                        {errors.end_date && (
                            <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting
                        ? isEditMode ? 'Saving…' : 'Creating…'
                        : isEditMode ? 'Save Changes' : 'Create Tournament'}
                </button>
            </form>
        </div>
    );
}