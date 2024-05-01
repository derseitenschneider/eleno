import { useState } from "react";

import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import LoginHeader from "./LoginHeader.component";
import ResetCard from "./ResetCard.component";
import SuccessCard from "./SuccessCard.component";

type ForgotPasswordProps = {
	className: string;
};

function ForgotPassword({ className }: ForgotPasswordProps) {
	const [recoverSuccess, setRecoverSuccess] = useState(false);

	const [, setSearchParams] = useSearchParams();

	return (
		<div className={className}>
			<LoginHeader
				preText="Noch kein Benutzerkonto?"
				buttonText="Sign up"
				onClick={() => setSearchParams({ page: "signup" })}
			/>

			{!recoverSuccess ? (
				<ResetCard />
			) : (
				<SuccessCard />
				/*{ <div
          className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
            justify-center gap-2 py-20"
        >
          <Card className="bg-zinc-50 px-8 py-8">
            <h2 className="mb-4 text-center text-xl text-zinc-700">
              Link gesendet
            </h2>
            <p className="text-center text-zinc-700">
              Du hast eine E-Mail für's Zurücksetzen deines Passworts erhalten.
            </p>
            <p className="text-center text-zinc-700">Überprüfe dein Postfach</p>
          </Card>
        </div> }*/
			)}
		</div>
	);
}

export default ForgotPassword;
