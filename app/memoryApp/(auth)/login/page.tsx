import Login from "@/components/auth/Login";
import Link from "next/link";

const LoginPage = () => {
  return (
    <>
      <h1 className="text-center font-black text-xl mb-4">Login</h1>
      <Login />
      <p className="text-center mt-2">
        Don't have an account?{" "}
        <Link href="register" className="hover:underline text-sky-500">
          Register here
        </Link>
      </p>
    </>
  );
};

export default LoginPage;
