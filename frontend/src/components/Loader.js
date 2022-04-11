import React from "react";
import ContentLoader from "react-content-loader";

const Loader = (props) => {
  return (
    <ContentLoader
      speed={2}
      width={210}
      height={292}
      viewBox="0 0 400 160"
      backgroundColor="#ffffff"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
      <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
      <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
      <rect x="60" y="72" rx="3" ry="3" width="380" height="6" />
      <rect x="5" y="83" rx="3" ry="10" width="10" height="6" />
      <circle cx="20" cy="20" r="20" />
    </ContentLoader>
  );
};

export default Loader;
