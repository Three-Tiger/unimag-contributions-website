import React from "react";

function TextToHtmlConverter({ text }) {
  const htmlContent = { __html: text };

  return <div dangerouslySetInnerHTML={htmlContent} />;
}

export default TextToHtmlConverter;
