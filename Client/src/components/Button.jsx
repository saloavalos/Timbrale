import React from "react";

const Button = (props) => {
  return (
    <a className="flex justify-center py-2 px-4 border-2 border-primary rounded-md font-semibold text-xl hover:bg-secondary active:bg-purpleDark transition-all">
      {props.children}
    </a>
  );
};

export default Button;
