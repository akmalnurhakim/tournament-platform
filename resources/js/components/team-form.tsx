import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Toast from '@/components/toast';

type SportType = {
    id: number;
    name: string;
    is_team_based: boolean;
    players_on_field: number;
    min_players: number;
    max_players: number;
};

export type TeamFormErrors = Partial<Record<'name' | 'sport_type_id' | 'description' | 'logo', string>>;

export type TeamFormTeam = {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    sport_type: { id: number };
};

type TeamFormProps = {
    /** Pass an existing team to switch the form into edit mode. Omit for create mode. */
    team?: TeamFormTeam;
    flashSuccess?: string;
};

export function TeamForm({ team, flashSuccess }: TeamFormProps) {
    const isEditMode = !!team;

    const [sports, setSports] = useState<SportType[]>([]);

    const [form, setForm] = useState({
        sport_type_id: team ? String(team.sport_type.id) : '',
        name: team?.name ?? '',
        description: team?.description ?? '',
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(
        team?.logo ? `/storage/${team.logo}` : null,
    );

    const [errors, setErrors] = useState<TeamFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch('/api/sport-types')
            .then((res) => res.json())
            .then(setSports)
            .catch((err) => console.error(err));
    }, []);

    const selectedSport =
        sports.find((s) => String(s.id) === form.sport_type_id) ?? null;

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setLogoFile(file);
        setErrors((prev) => ({ ...prev, logo: undefined }));

        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const updateField = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = new FormData();
        if (isEditMode) {
            // Method spoofing — required for PATCH requests that carry a file.
            payload.append('_method', 'patch');
        }
        payload.append('name', form.name);
        payload.append('sport_type_id', form.sport_type_id);
        payload.append('description', form.description);
        if (logoFile) {
            payload.append('logo', logoFile);
        }

        const url = isEditMode ? `/teams/${team!.id}` : '/teams';

        router.post(url, payload, {
            forceFormData: true,
            onError: (errs) => setErrors(errs as TeamFormErrors),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Edit Team' : 'Create Team'}
            </h1>

            {flashSuccess && (
                <Toast message={flashSuccess} variant="success" />
            )}

            <form
                onSubmit={submit}
                className="space-y-5 border rounded-xl p-6 shadow"
            >
                {/* Name */}
                <div>
                    <label className="font-medium">Team Name</label>
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

                {/* Logo */}
                <div>
                    <label className="font-medium">
                        Team Logo{' '}
                        <span className="text-gray-500 text-sm">(optional)</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full border rounded p-2"
                        onChange={handleLogoChange}
                    />
                    {logoPreview && (
                        <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="mt-2 h-20 w-20 object-cover rounded border"
                        />
                    )}
                    {errors.logo && (
                        <p className="text-sm text-red-600 mt-1">{errors.logo}</p>
                    )}
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

                {/* Sport Rule Info */}
                {selectedSport && (
                    <div className="bg-gray-100 rounded p-4">
                        <p>
                            Type: {selectedSport.is_team_based ? 'Team' : 'Individual'}
                        </p>

                        {selectedSport.is_team_based && (
                            <>
                                <p>
                                    Players on field: {selectedSport.players_on_field}
                                </p>
                                <p>
                                    Squad size: {selectedSport.min_players} -{' '}
                                    {selectedSport.max_players}
                                </p>
                            </>
                        )}

                        {!selectedSport.is_team_based && (
                            <p className="text-sm text-gray-600 mt-1">
                                This sport is individual — teams aren't used in
                                tournaments of this type.
                            </p>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting
                        ? isEditMode ? 'Saving…' : 'Creating…'
                        : isEditMode ? 'Save Changes' : 'Create Team'}
                </button>
            </form>

        </div>
    );
}