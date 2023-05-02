import React, { useState } from "react";

function Genre({ name, onClick }) {
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setIsActive(!isActive);
    onClick();
  }

  return (
    <button
      className={
        isActive
          ? "btn btn-info btn-sm genreButton"
          : "btn btn-outline btn-sm genreButton"
      }
      onClick={handleClick}
    >
      {name}
    </button>
  );
}

export default Genre;
