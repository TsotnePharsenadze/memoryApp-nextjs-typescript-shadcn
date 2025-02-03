"use client";

import getUserById from "@/actions/getUserById";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const ProfilePage = () => {
  // const [fullUserData, setFullUserData] = useState<User | null>(null);
  // const user = useSession();

  // useEffect(() => {
  //   async function fetchUserData() {
  //     const res = await getUserById(user?.data?.user?.id as string);
  //     setFullUserData(res);
  //   }
  //   if (user.status === "authenticated") {
  //     fetchUserData();
  //   }
  // }, [user]);

  const [user, setUser] = useState<any>({
    name: "John",
    surname: "Doe",
    username: "johndoe123",
    email: "john.doe@example.com",
    avatarUrl:
      "https://fastly.picsum.photos/id/538/200/300.jpg?hmac=QyW9exvhaGnW9uknxjXGZYm6JAtg9ctqbnYTTwBk61o",
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.avatarUrl} alt="@shadcn" />
              <AvatarFallback>{user.avatarUrl}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {user.name} {user.surname}
              </h2>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <p>Name</p>
                <Input value={user.name} readOnly />
              </div>
              <div className="flex flex-col flex-1">
                <p>Surname</p>
                <Input value={user.surname} readOnly />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <p>Username</p>
                <Input value={user.username} readOnly />
              </div>
              <div className="flex flex-col flex-1">
                <p>Name</p>
                <Input value={user.email} readOnly />
              </div>
            </div>
            <div className="flex justify-between">
              <Link href="/change-password">
                <Button variant="outline" className="bg-red-600 text-white hover:bg-red-700 hover:text-white">
                  <FaTrash /> Delete Account
                </Button>
              </Link>
              <Link href="/change-password">
                <Button variant="outline">Change Password</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
