// app/_components/FileUploadModal.tsx
"use client";

import React, { useRef, useState } from "react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FileUploadModalProps {
  onUpload: (files: FileList) => void;
  onClose: () => void;
  allowedTypes?: string;
  multiple?: boolean;
}

const FileUploadModal = ({
  onUpload,
  onClose,
  allowedTypes = ".csv",
  multiple = true,
}: FileUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleSubmit = () => {
    if (selectedFiles) {
      onUpload(selectedFiles);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-white mb-4">
          Upload Transaction Files
        </h2>

        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
            dragActive
              ? "border-blue-500 bg-blue-50 bg-opacity-10"
              : "border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            placeholder="file"
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={allowedTypes}
            onChange={handleChange}
            className="hidden"
          />

          {selectedFiles ? (
            <div className="text-white">
              <p className="font-medium">
                {selectedFiles.length} file(s) selected
              </p>
              <ul className="mt-2 text-sm text-gray-300">
                {Array.from(selectedFiles).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-gray-300">
              <p>Drag and drop your CSV files here</p>
              <p className="mt-2">or</p>
              <Button className="mt-2">Browse Files</Button>
              <p className="mt-4 text-xs text-gray-400">
                Supported format: CSV
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedFiles}
            className={`px-4 py-2 rounded ${
              selectedFiles
                ? "bg-blue-600 text-white hover:bg-primary-300"
                : "bg-blue-800 text-gray-300 cursor-not-allowed"
            }`}
          >
            Upload
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FileUploadModal;
