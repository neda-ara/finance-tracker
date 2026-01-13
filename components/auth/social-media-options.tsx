import Image from "next/image";

export const SocialMediaOptions = () => {
  return (
    <div className="w-full text-center">
      <div className="flex items-center justify-center gap-x-4">
        <div className="h-px flex-1 bg-gray-300" />
        <p className="font-medium">OR</p>
        <div className="h-px flex-1 bg-gray-300" />
      </div>
      <div className="cursor-pointer mx-auto flex items-center justify-center my-2 gap-x-1 w-fit border-2 border-gray-300 pl-4 pr-6 rounded-full">
        <Image
          alt="google-logo"
          height={32}
          width={32}
          className="h-8 max-w-fit aspect-square object-contain"
          src={"/logos/google.png"}
        />
        <p className="font-semibold text-sm">Continue with Google</p>
      </div>
    </div>
  );
};
