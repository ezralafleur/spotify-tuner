import React, { useState } from "react";

function Genre({ name, onClick, isActive, disabled }) {
  return (
    <button
      disabled={disabled}
      className={
        isActive
          ? "btn btn-info btn-sm genreButton"
          : "btn btn-outline btn-sm genreButton"
      }
      onClick={() => {
        onClick();
      }}
    >
      {name}
    </button>
  );
}

export default Genre;
