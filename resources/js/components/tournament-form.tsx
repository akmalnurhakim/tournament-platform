import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type SportType = {
    id: number;
    name: string;
    is_team_based: boolean;
    players_on_field: number;
    min_players: number;
    max_players: number;
};

export type TournamentFormData = {
    id: number;
    name: string;
    description: string | null;
    sport_type_id: number;
    is_team_based: boolean;
    start_date: string;
    end_date: string;
    status: string;
};

type TournamentFormErrors = Partial<Record<
    'name' | 'description' | 'sport_type_id' | 'start_date' | 'end_date',
    string
>>;

type TournamentFormProps = {
    /** Pass an existing tournament to switch into edit mode. Omit for create. */
    tournament?: TournamentFormData;
    flashSuccess?: string;
};

export function TournamentForm({ tournament, flashSuccess }: TournamentFormProps) {
    const isEditMode = !!tournament;

    const [sports, setSports] = useState<SportType[]>([]);
    const [errors, setErrors] = useState<TournamentFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        sport_type_id: tournament ? String(tournament.sport_type_id) : '',
        name: tournament?.name ?? '',
        description: tournament?.description ?? '',
        is_team_based: tournament?.is_team_based ?? false,
        start_date: tournament?.start_date
            ? tournament.start_date.slice(0, 10)
            : '',
        end_date: tournament?.end_date
            ? tournament.end_date.slice(0, 10)
            : '',
    });

    useEffect(() => {
        fetch('/api/sport-types')
            .then((res) => res.json())
            .then(setSports)
            .catch((err) => console.error(err));
    }, []);

    const selectedSport =
        sports.find((s) => String(s.id) === form.sport_type_id) ?? null;

    const updateField = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const changeSport = (id: string) => {
        const sport = sports.find((s) => String(s.id) === id);
        setForm((prev) => ({
            ...prev,
            sport_type_id: id,
            is_team_based: sport?.is_team_based ?? false,
        }));
        setErrors((prev) => ({ ...prev, sport_type_id: undefined }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const url = isEditMode
            ? `/tournaments/${tournament!.id}`
            : '/tournaments';

        const method = isEditMode ? router.patch : router.post;

        method(url, form, {
            onError: (errs) => setErrors(errs as TournamentFormErrors),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Edit Tournament' : 'Create Tournament'}
            </h1>

            <form
                onSubmit={submit}
                className="space-y-5 border rounded-xl p-6 shadow"
            >
                {/* Name */}
                <div>
                    <label className="font-medium">Tournament Name</label>
                    <input
                        className="w-full border rounded p-2"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        required
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
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

                {/* Sport */}
                <div>
                    <label className="font-medium">Sport Type</label>
                    <select
                        className="w-full border rounded p-2"
                        value={form.sport_type_id}
                        onChange={(e) => changeSport(e.target.value)}
                        required
                    >
                        <option value="">Select sport</option>
                        {sports.map((sport) => (
                            <option key={sport.id} value={sport.id}>
                                {sport.name}
                            </option>
                        ))}
                    </select>
                    {errors.sport_type_id && (
                        <p className="text-sm text-red-600 mt-1">{errors.sport_type_id}</p>
                    )}
                </div>

                {/* Sport info */}
                {selectedSport && (
                    <div className="rounded p-4 bg-muted/50 text-sm space-y-1">
                        <p>Type: {selectedSport.is_team_based ? 'Team' : 'Individual'}</p>
                        {selectedSport.is_team_based && (
                            <>
                                <p>Players on field: {selectedSport.players_on_field}</p>
                                <p>
                                    Squad size: {selectedSport.min_players} –{' '}
                                    {selectedSport.max_players}
                                </p>
                            </>
                        )}
                    </div>
                )}

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