import React from "react";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";
import styles from "./CodeDownloader.module.css";

const CodeDownloader = (prop) => {
  const handleDownload = () => {
    const file = new Blob([prop.data], { type: "text/plain;charset=utf-8" });
    saveAs(file, prop.filename);
  };

  return (
    <button className={styles.button_downloader} onClick={handleDownload}>
      <FaDownload />
    </button>
  );
};

export default CodeDownloader;
