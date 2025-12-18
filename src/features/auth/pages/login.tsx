/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { LanguageToggle } from "@/shared/components/language-toggle";
import bankLogo from "@/assets/finza.png";
import { LoginForm } from "../components/LoginForm";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <div className="min-h-screen w-full flex">
      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-end gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          <LoginForm />
        </div>
      </div>

      {/* LEFT SIDE */}
      <div
        className={clsx(
          "hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary",
          {
            "rounded-l-[3rem]": !isRTL,
            "rounded-r-[3rem]": isRTL,
          }
        )}
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-cover bg-center bg-black">
          <div className="absolute inset-0 bg-blend-luminosity" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-end w-full p-12 pb-24">
          <div className="text-center space-y-4">
            <img
              src={bankLogo}
              alt="Bank logo"
              className="
                w-xl
                max-w-full
                h-auto
                object-contain
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
