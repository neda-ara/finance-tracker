import { Abril_Fatface } from "next/font/google";

const abrilFatface = Abril_Fatface({
  weight: ["400"],
});

export const LoginForm = () => {
  return (
    <div className="flex flex-col">
      <h1 className={`${abrilFatface.className} text-4xl tracking-wider`}>
        Welcome Back
      </h1>
    </div>
  );
};
