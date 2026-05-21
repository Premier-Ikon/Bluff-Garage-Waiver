import Image from "next/image";
import { WaiverContent } from "@/components/WaiverContent";
import { WaiverForm } from "@/components/WaiverForm";

const cardClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-6 shadow-md";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-6 bg-white px-[7.5vw] pt-[72px] pb-10">
      <Image
        src="/bluff-logo.png"
        alt="The Bluff Garage"
        width={932}
        height={257}
        priority
        className="mb-6 h-auto w-56 sm:w-64"
      />

      <div className="flex w-[85vw] flex-col gap-4">
        <div className={`${cardClass} py-6`}>
          <WaiverContent />
        </div>

        <div className={`${cardClass} py-[50px]`}>
          <WaiverForm />
        </div>
      </div>
    </main>
  );
}
