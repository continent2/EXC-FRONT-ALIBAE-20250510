const Spinner = () => {
  return (
    <div
      className="tradex-w-full tradex-h-full tradex-flex tradex-items-center tradex-justify-center"
      role="status"
    >
      <div
        className="spinner-border spinner-border-sm text-secondary"
        style={{ width: "1.25rem", height: "1.25rem" }}
        role="status"
      ></div>
    </div>
  );
};

export default Spinner;
