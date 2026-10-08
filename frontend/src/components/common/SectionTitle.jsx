function SectionTitle({
  eyebrow,
  title,
  description,
  light = false,
  align = "left",
  className = "",
}) {
  const center = align === "center";

  return (
    <div
      className={`max-w-3xl ${light ? "on-dark" : ""} ${center ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow && (
        <p className={`eyebrow mb-5 ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>
      )}

      <h2 className={`display display-lg ${light ? "text-white" : "text-[#0e1411]"}`}>
        {title}
      </h2>

      {description && (
        <p className={`lead mt-5 max-w-2xl ${center ? "mx-auto" : ""}`}>{description}</p>
      )}
    </div>
  );
}

export default SectionTitle;
