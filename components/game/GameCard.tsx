"use client";

import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const GameCard = ({
  title,
  description,
  content,
  footer,
  imageSrc,
  bgColor,
  imageAlt,
}: {
  title: string;
  description: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  imageSrc: string;
  bgColor: string;
  imageAlt: string;
}) => {
  let session = useSession();
  const router = useRouter();

  const goTo = (href: string) => {
    if (session?.status == "authenticated") {
      router.push(`/memoryApp/${href.toLowerCase()}`);
    } else if (session?.status == "unauthenticated") {
      router.push(`/memoryApp/login`);
    }
  };

  return (
    <Card
      className="hover:-translate-y-2 transition-all cursor-pointer"
      onClick={() => goTo(title)}
    >
      <CardHeader>
        <div
          className="h-[200px] bg-center flex justify-center items-center mb-2"
          style={{ backgroundColor: bgColor }}
        >
          <Image src={imageSrc} width={200} height={200} alt={imageAlt} />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {content && <CardContent>{content}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default GameCard;
