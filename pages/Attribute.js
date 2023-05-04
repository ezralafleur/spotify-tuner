export default function Attribute({
  name,
  active,
  value,
  min,
  max,
  setActivation,
  handleAttributeChange,
}) {
  return (
    <div className="card card-bordered card-compact attributeContainer p-5">
      <label
        className="card-title capitalize text-base rangeLabel"
        htmlFor={name + "Range"}
      >
        {name}
      </label>
      <div className="card-actions">
        <label className="text-xs activateLabel" htmlFor={name + "Activate"}>
          Use this attribute
        </label>
        <input
          className="toggle toggle-success toggle-sm activateCheckbox"
          id={name + "Activate"}
          checked={active}
          type="checkbox"
          onChange={(e) => {
            setActivation(name, e.target.checked);
          }}
        />

        <br></br>
        <input
          type="range"
          className="range range-s lg:range-xs attributeRange w-9/12 lg:w-10/12"
          name={name}
          id={name + "Range"}
          min={min}
          max={max}
          defaultValue={value}
          step={max / 10}
          onChange={(e) => {
            handleAttributeChange(name, e.target.value);
          }}
        ></input>
        <span className="attributeValue ml-6">{value}</span>
      </div>
    </div>
  );
}
