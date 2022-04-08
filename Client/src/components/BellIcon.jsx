import { useState, useEffect } from "react";

const BellIcon = ({ primaryColor, secondaryColor, size }) => {
  const [sizeSVG, setSizeSVG] = useState("30");

  useEffect(() => {
    // If we receive from props a size it means we do not want to use the default size
    if (size) {
      setSizeSVG(size);
    } else {
      // Default size
      setSizeSVG("41");
    }
  }, [sizeSVG]);

  return (
    <svg
      width={sizeSVG}
      height={sizeSVG}
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.23353"
        y="1.06092"
        width="38.8856"
        height="38.8856"
        rx="19.4428"
        fill={secondaryColor}
        stroke={primaryColor}
        strokeWidth="1.20265"
      />
      <path
        d="M26.7138 17.4561C26.7138 15.819 26.0635 14.2489 24.9059 13.0913C23.7482 11.9337 22.1782 11.2834 20.5411 11.2834C18.904 11.2834 17.3339 11.9337 16.1763 13.0913C15.0187 14.2489 14.3683 15.819 14.3683 17.4561C14.3683 24.6576 11.282 26.7152 11.282 26.7152H29.8002C29.8002 26.7152 26.7138 24.6576 26.7138 17.4561Z"
        fill={primaryColor}
        stroke="#191919"
        strokeWidth="2.03002"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.3208 30.8304C22.14 31.1422 21.8804 31.401 21.568 31.5809C21.2556 31.7608 20.9015 31.8555 20.541 31.8555C20.1806 31.8555 19.8264 31.7608 19.5141 31.5809C19.2017 31.401 18.9421 31.1422 18.7612 30.8304"
        stroke="#191919"
        strokeWidth="2.03002"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2532 17.4561C10.2532 15.1928 10.9733 13.0323 12.3108 11.2834"
        stroke="#191919"
        strokeWidth="2.03002"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30.8289 17.4561C30.8289 15.2301 30.107 13.0642 28.7714 11.2834"
        stroke="#191919"
        strokeWidth="2.03002"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BellIcon;
