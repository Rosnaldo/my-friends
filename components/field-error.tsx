type State = {
    errors?: Record<string, string[]>;
    message?: string | null;
}

type Props = {
    state: State;
    names: string[];
}

const or = (arr: boolean[]) => arr.reduce((a, b) => a || b, false); 

export default function FieldError(
  { state, names }: Props,
) {
  const errors = names
  .filter(n => state.errors?.[n])
  .map(n => state.errors![n] as string[])
  .reduce((a, b) => [...a, ...b], []);

  if (!errors.length) return <></>
  if (!errors[0]) return <></>

  return (
    <>
        {
            <p className="mt-2 text-sm text-red-500">
                {errors[0]}
            </p>
        }
    </>
  );
}
