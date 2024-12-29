const Error = ({ error }: { error: string }) => {
  return (
    <p className="text-destructive font-semibold bg-destructive/15 rounded-md p-2">
      {error}
    </p>
  );
};

export default Error;
