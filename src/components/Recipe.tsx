import ReactMarkdown from "react-markdown";

export default function Recipe({ recipeText }: { recipeText: string }) {
  return (
    <div className="flex flex-col gap-5 mt-12 ml-48 mr-48">
      <span className="text-2xl font-medium">Chef claude recommends:</span>
      <div
        className="flex flex-col leading-6 text-md 
      [&_h1]:text-2xl
      [&_h1]:font-semibold
      [&_h2]:text-xl
      [&_h2]:font-semibold
      [&_h3]:text-lg
      [&_h3]:font-semibold"
      >
        <ReactMarkdown>{recipeText}</ReactMarkdown>
      </div>
    </div>
  );
}
