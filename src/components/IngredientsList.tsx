interface IngredientsProps {
  ingredients: string[];
}
export default function IngredientsList({ ingredients }: IngredientsProps) {
  const elements = ingredients.map((item) => {
    return <li key={item}>{item}</li>;
  });
  return (
    <div className="ml-48 mr-16 flex flex-col gap-6">
      <span className="text-2xl font-medium">Ingredients on hand:</span>
      <ul className="ml-3 list-disc font-thin">{elements}</ul>
    </div>
  );
}
