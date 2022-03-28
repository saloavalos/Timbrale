import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <a
      onClick={onClick}
      className="flex justify-center py-2 px-4 border-2 border-primary rounded-md font-semibold text-xl md:hover:bg-secondary active:bg-purpleDark transition-all"
    >
      {text}
    </a>
  );
};

export default Button;
