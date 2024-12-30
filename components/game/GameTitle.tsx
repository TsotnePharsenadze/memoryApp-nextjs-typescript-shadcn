const GameTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="text-center">
      <h1 className="font-black text-2xl">{title}</h1>
      <span className="text-sm leading-tight uppercase text-gray-600">{subtitle}</span>
    </div>
  );
};

export default GameTitle;
