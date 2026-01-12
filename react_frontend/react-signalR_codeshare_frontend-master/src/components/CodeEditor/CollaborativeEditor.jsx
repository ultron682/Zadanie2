import React, { useRef } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/go/go.js";
import "codemirror/mode/php/php.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/swift/swift.js";

const CollaborativeEditor = ({
  documentContent,
  setDocumentContent,
  languageProg,
  theme,
  onHandleEditorChange,
  isConnected,
  readOnlyDocument,
}) => {
  const editorRef = useRef(null);

  return (
    <CodeMirror
      ref={editorRef}
      value={documentContent}
      options={{
        mode: languageProg,
        theme: theme === "light" ? "material" : "material-darker",
        lineNumbers: true,
        lineWrapping: true,
        readOnly: !isConnected || readOnlyDocument ? "nocursor" : false,
      }}
      onBeforeChange={(editor, data, value) => {
        setDocumentContent(value);
        onHandleEditorChange(editor, data, value);
      }}
    />
  );
};

export default CollaborativeEditor;
