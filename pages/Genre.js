import React, { useState } from "react";

function Genre({ name, onClick, isActive, disabled }) {
  return (
    <button
      disabled={disabled}
      className={"btn btn-xs m-1 " + (isActive ? "btn-info" : "btn-outline")}
      onClick={() => {
        onClick();
      }}
    >
      {name}
    </button>
  );
}

export default Genre;
