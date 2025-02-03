import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const AvatarCompo = ({ AvatarImg }: { AvatarImg: string }) => {
  return (
    <Avatar>
      <AvatarImage src={AvatarImg} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default AvatarCompo;
