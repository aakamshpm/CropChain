const InputField = ({
  label,
  type,
  name,
  value,
  placeHolder,
  onChangeHandler,
}) => {
  return (
    <>
      <label>{label}</label>
      <input
        className="input-field"
        type={type}
        name={name}
        value={value}
        placeholder={placeHolder}
        onChange={onChangeHandler}
      />
    </>
  );
};

export default InputField;
