const InputField = ({
  label,
  type,
  name,
  value,
  placeHolder,
  onChangeHandler,
  parentKey,
}) => {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input
        className="input-field"
        type={type}
        name={name}
        value={value || ""}
        placeholder={placeHolder}
        onChange={(e) => onChangeHandler(e, parentKey)}
      />
    </div>
  );
};

export default InputField;
