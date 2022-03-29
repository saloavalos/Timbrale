import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <a
      onClick={onClick}
      className="flex justify-center py-2 px-4 bg-secondary border-[1.5px] border-primary rounded-md font-semibold text-xl md:hover:bg-purpleDark active:bg-purpleDark transition-all"
    >
      {text}
    </a>
  );
};

export default Button;
