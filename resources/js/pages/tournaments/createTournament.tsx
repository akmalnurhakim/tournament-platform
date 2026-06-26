import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { dashboard } from '@/routes';


export default function CreateTournament() {

    const [sports, setSports] = useState<any[]>([]);
    const [selectedSport, setSelectedSport] = useState<any>(null);


    const [form, setForm] = useState({
        sport_type_id: '',
        name: '',
        description: '',
        is_team_based: false,
        start_date: '',
        end_date: '',
        status: 'upcoming',
    });


    useEffect(() => {

        fetch('/api/sport-types')
            .then(res => res.json())
            .then(data => {
                setSports(data);
            })
            .catch(err => console.error(err));

    }, []);



    const submit = (e: React.FormEvent) => {

        e.preventDefault();


        router.post(
            '/tournaments',
            form,
            {
                onSuccess: () => {

                    alert('Tournament created');

                },

                onError: (errors) => {

                    console.log(errors);

                }
            }
        );

    };



    const updateField = (field:string,value:any) => {
        setForm(prev => ({
            ...prev,
            [field]:value
        }));

    };



    const changeSport = (id:string) => {
        const sport = sports.find(
            s => String(s.id) === id
        );


        setSelectedSport(sport);
        setForm(prev => ({
            ...prev,
            sport_type_id:id,
            is_team_based:
                sport?.is_team_based ?? false
        }));

    };



    return (
        <>
        <Head title="Create Tournament" />

        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                Create Tournament
            </h1>

            <form
                onSubmit={submit}
                className="space-y-5 border rounded-xl p-6 shadow"
            >
                {/* Name */}

                <div>
                    <label className="font-medium">
                        Tournament Name
                    </label>

                    <input
                        className="w-full border rounded p-2"
                        value={form.name}
                        onChange={e =>updateField('name',e.target.value)
                        }
                        required
                    />
                </div>




                {/* Description */}

                <div>

                    <label className="font-medium">
                        Description
                    </label>

                    <textarea
                        className="w-full border rounded p-2"
                        rows={4}
                        value={form.description}
                        onChange={e =>
                            updateField(
                                'description',
                                e.target.value
                            )
                        }
                    />

                </div>





                {/* Sport */}

                <div>

                    <label className="font-medium">
                        Sport Type
                    </label>


                    <select
                        className="w-full border rounded p-2"
                        value={form.sport_type_id}
                        onChange={e =>
                            changeSport(e.target.value)
                        }
                        required
                    >

                        <option value="">
                            Select sport
                        </option>


                        {sports.map(sport => (

                            <option
                                key={sport.id}
                                value={sport.id}
                            >
                                {sport.name}
                            </option>

                        ))}


                    </select>

                </div>





                {/* Sport Rule Info */}

                {selectedSport && (

                    <div className="bg-gray-100 rounded p-4">


                        <p>
                            Type:
                            {' '}
                            {
                              selectedSport.is_team_based
                              ? 'Team'
                              : 'Individual'
                            }
                        </p>


                        {selectedSport.is_team_based && (

                            <>
                            <p>
                                Players on field:
                                {' '}
                                {selectedSport.players_on_field}
                            </p>


                            <p>
                                Squad size:
                                {' '}
                                {selectedSport.min_players}
                                {' - '}
                                {selectedSport.max_players}
                            </p>

                            </>

                        )}

                    </div>

                )}






                {/* Dates */}

                <div className="grid md:grid-cols-2 gap-4">


                    <input
                        type="date"
                        className="border rounded p-2"
                        value={form.start_date}
                        onChange={e =>
                            updateField(
                                'start_date',
                                e.target.value
                            )
                        }
                        required
                    />


                    <input
                        type="date"
                        className="border rounded p-2"
                        value={form.end_date}
                        onChange={e =>
                            updateField(
                                'end_date',
                                e.target.value
                            )
                        }
                        required
                    />


                </div>






                {/* Status */}

                <select
                    className="w-full border rounded p-2"
                    value={form.status}
                    onChange={e =>
                        updateField(
                            'status',
                            e.target.value
                        )
                    }
                >

                    <option value="upcoming">
                        Upcoming
                    </option>

                    <option value="ongoing">
                        Ongoing
                    </option>

                    <option value="completed">
                        Completed
                    </option>

                </select>






                <button
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                    Create Tournament
                </button>


            </form>

        </div>

        </>
    );
}



CreateTournament.layout = {
    breadcrumbs:[
        {
            title:'Dashboard',
            href:dashboard()
        },
        {
            title:'Create Tournament',
            href:'/tournaments/create'
        }
    ]
};