const cards = [
  {
    title: "Sign up for a free account",
    description:
      "Get started with our platform in minutes. Add your whole team at no extra cost.",
  },
  {
    title: "Add your platform credentials",
    description:
      "Enter your own platform credentials or use pre-built integrations.",
  },
  {
    title: "Connect accounts and post",
    description:
      "Use the API to connect social media accounts and start posting instantly.",
  },
];

export function Problem() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <h2 className="text-4xl lg:text-5xl font-normal leading-tight max-w-2xl">
        {
          "Building native social media integrations shouldn’t drain dev resources."
        }
      </h2>

      <ol className="grid grid-cols-1 gap-4 max-w-lg list-decimal pl-4">
        {cards.map((card) => (
          <li key={card.title}>
            <h3 className="text-base md:text-xl font-bold">{card.title}</h3>
            <p className="text-muted-foreground">{card.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
