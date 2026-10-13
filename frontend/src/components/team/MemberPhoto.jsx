import { useState } from "react";
import { initials } from "../../lib/team";

/** Member photo with an initials fallback when there is no photo or it fails to load. */
export default function MemberPhoto({ member, className = "", textClassName = "text-3xl" }) {
  const [failedSrc, setFailedSrc] = useState("");
  const showImage = member.photoUrl && failedSrc !== member.photoUrl;

  return (
    <div className={`relative overflow-hidden bg-[#0d1b14] ${className}`}>
      {showImage ? (
        <img
          src={member.photoUrl}
          alt={member.name}
          loading="lazy"
          onError={() => setFailedSrc(member.photoUrl)}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center font-serif italic text-[#7be0b4] ${textClassName}`}
        >
          {initials(member.name)}
        </span>
      )}
    </div>
  );
}
