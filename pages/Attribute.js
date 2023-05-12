export default function Attribute({
  name,
  label,
  active,
  value,
  min,
  max,
  setActivation,
  handleAttributeChange,
  description,
}) {
  return (
    <div className="card card-bordered card-compact attributeContainer p-5">
      <label
        className="card-title text-base rangeLabel"
        htmlFor={name + "Range"}
      >
        {label}{" "}
        {description ? (
          <span className="tooltip" data-tip={description}>
            <button className="btn btn-xs btn-outline btn-circle">?</button>
          </span>
        ) : (
          ""
        )}
      </label>
      <div className="card-actions mt-2">
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
          value={value}
          step={(max - min) / 10}
          onChange={(e) => {
            handleAttributeChange(name, e.target.value);
          }}
        ></input>
        <span className="attributeValue ml-5 text-xs">{value}</span>
      </div>
    </div>
  );
}
