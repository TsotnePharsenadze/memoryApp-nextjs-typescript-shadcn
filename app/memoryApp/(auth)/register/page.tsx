import Register from "@/components/auth/Register";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <>
      <h1 className="text-center font-black text-xl mb-4">Registration</h1>
      <Register />
      <p className="text-center mt-2">
        Already have an account?{" "}
        <Link href="login" className="hover:underline text-sky-500">
          Login here
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;
