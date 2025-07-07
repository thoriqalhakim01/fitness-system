import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Exercise } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';

type CreateLogForm = {
    log_date: string;
    notes: string;
    exercises: {
        name: string;
        sets: string;
        reps: string;
        weight: string;
    }[];
    weight: string;
    progress_notes: string;
};

export default function AddLogForm({ id }: { id: string }) {
    const { data, setData, post, processing, errors, reset } = useForm<CreateLogForm>({
        log_date: new Date().toISOString().split('T')[0],
        notes: '',
        exercises: [{ name: '', sets: '', reps: '', weight: '' }],
        weight: '',
        progress_notes: '',
    });

    const addExercise = () => {
        setData('exercises', [...data.exercises, { name: '', sets: '', reps: '', weight: '' }]);
    };

    const removeExercise = (index: number) => {
        if (data.exercises.length > 1) {
            const newExercises = data.exercises.filter((_, i) => i !== index);
            setData('exercises', newExercises);
        }
    };

    const updateExercise = (index: number, field: keyof Exercise, value: string) => {
        const newExercises = [...data.exercises];
        newExercises[index][field] = value;
        setData('exercises', newExercises);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('trainer.handle-add-log', id), {
            preserveScroll: true,
            onSuccess: (res) => {
                console.log(res);
            },
            onError: (err) => {
                console.log(err);
            },
        });
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="log_date">Log Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="log_date"
                            tabIndex={1}
                            variant={'outline'}
                            className={cn('w-full pl-3 text-left font-normal', !data.log_date && 'text-muted-foreground')}
                            type="button"
                        >
                            {data.log_date ? format(new Date(data.log_date), 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={new Date(data.log_date)}
                            onSelect={(date) => {
                                if (date) {
                                    setData('log_date', format(date, 'yyyy-MM-dd'));
                                }
                            }}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                        />
                    </PopoverContent>
                </Popover>
                <InputError message={errors.log_date} className="mt-1" />
            </div>

            {/* Weight */}
            <div className="grid gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    max="500"
                    tabIndex={2}
                    value={data.weight}
                    onChange={(e) => setData('weight', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. 70.5"
                />
                <InputError message={errors.weight} className="mt-1" />
            </div>

            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <Label>Exercises</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addExercise} disabled={processing}>
                        <Plus className="mr-1 h-4 w-4" />
                        Add Exercise
                    </Button>
                </div>

                <div className="space-y-4">
                    {data.exercises.map((exercise, index) => (
                        <div key={index} className="space-y-3 rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Exercise {index + 1}</h4>
                                {data.exercises.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeExercise(index)}
                                        disabled={processing}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <Label htmlFor={`exercise-name-${index}`}>Exercise Name</Label>
                                    <Input
                                        id={`exercise-name-${index}`}
                                        type="text"
                                        value={exercise.name}
                                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g. Bench Press"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`exercise-sets-${index}`}>Sets</Label>
                                    <Input
                                        id={`exercise-sets-${index}`}
                                        type="number"
                                        min="1"
                                        value={exercise.sets}
                                        onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g. 3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`exercise-reps-${index}`}>Reps</Label>
                                    <Input
                                        id={`exercise-reps-${index}`}
                                        type="number"
                                        min="1"
                                        value={exercise.reps}
                                        onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g. 10"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor={`exercise-weight-${index}`}>Weight (kg) - Optional</Label>
                                    <Input
                                        id={`exercise-weight-${index}`}
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={exercise.weight}
                                        onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g. 60.5"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {errors.exercises && <InputError message={errors.exercises} className="mt-1" />}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="notes">General Notes</Label>
                <Textarea
                    id="notes"
                    tabIndex={4}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. Member felt energetic today, good form on all exercises..."
                    className="min-h-[80px]"
                    rows={3}
                />
                <InputError message={errors.notes} className="mt-1" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="progress_notes">Progress Notes</Label>
                <Textarea
                    id="progress_notes"
                    tabIndex={5}
                    value={data.progress_notes}
                    onChange={(e) => setData('progress_notes', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. Increased weight on bench press, improved squat form, ready for next level..."
                    className="min-h-[80px]"
                    rows={3}
                />
                <p className="text-sm text-muted-foreground">Note improvements, areas to work on, and next session recommendations</p>
                <InputError message={errors.progress_notes} className="mt-1" />
            </div>

            <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" tabIndex={6} disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Add Log Entry
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setData({
                            log_date: new Date().toISOString().split('T')[0],
                            notes: '',
                            exercises: [{ name: '', sets: '', reps: '', weight: '' }],
                            weight: '',
                            progress_notes: '',
                        });
                    }}
                    disabled={processing}
                >
                    Reset
                </Button>
            </div>
        </form>
    );
}
