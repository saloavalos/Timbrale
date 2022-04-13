export const Button = ({ text, onClick, type }) => {
  return (
    <a
      onClick={onClick}
      className={
        "flex justify-center py-2 px-4 bg-secondary border-[1.5px] border-primary rounded-md font-semibold text-xl md:hover:bg-purpleDark active:bg-purpleDark transition-all"
      }
    >
      {text}
    </a>
  );
};
export default Button;

export const ButtonRinging = ({ text, onClick, primaryColor }) => {
  const tagStyle = {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  };

  return (
    <a
      onClick={onClick}
      style={tagStyle}
      className={
        "flex justify-center border py-2 px-4 bg-transparent rounded-md font-semibold text-xl md:hover:opacity-80 active:opacity-80 transition-all"
      }
    >
      {text}
    </a>
  );
};
