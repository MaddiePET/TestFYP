"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from "@/icons/chevron-left.svg";
import { useFormData } from "@/context/FormContext";

interface DocEntry {
  id: number;
  name: string;
  preview: string | null;
  fileName: string | null;
  fileType: string | null;
  fileBase64: string | null;
}

export default function BusinessMalaysianSupportingDocuments() {
  const router = useRouter();
  const { formData, setFormData } = useFormData();

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<DocEntry[]>(
    formData?.supportingDocuments?.length
      ? formData.supportingDocuments
      : [
          {
            id: 1,
            name: "",
            preview: null,
            fileName: null,
            fileType: null,
            fileBase64: null,
          },
        ]
  );

  const updateDoc = (id: number, fields: Partial<DocEntry>): void => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...fields } : d))
    );
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFile = async (id: number, file: File | undefined): Promise<void> => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, DOC and DOCX files are allowed.");
      return;
    }

    const base64 = await fileToBase64(file);

    updateDoc(id, {
      preview: file.name,
      fileName: file.name,
      fileType: file.type,
      fileBase64: base64,
    });
  };

  const handleContinue = () => {
    setFormData((prev: any) => ({
      ...prev,
      supportingDocuments: documents,
    }));

    router.push("/business/malaysian/account_creation");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 bg-[#F9FAFB] dark:bg-gray-950 overflow-hidden">
      <div className="absolute top-6 left-4 right-4 flex justify-between items-center max-w-7xl mx-auto w-full z-20">
        <button
          type="button"
          onClick={() => router.push("/business/malaysian/face_verification")}
          className="inline-flex items-center text-sm text-gray-600 dark:text-white/80 transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeftIcon className="w-5 h-5" /> Back
        </button>

        <div className="flex items-center gap-2">
          <Image
            src="/images/logo/logo-light.svg"
            alt="Logo"
            width={40}
            height={40}
            className="block dark:invert-0 invert"
          />
          <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-800 dark:text-white">
            DTCOB
          </h1>
        </div>
      </div>

      <div className="relative w-full max-w-2xl z-10">
        <div className="space-y-8">
          {documents.map((doc, index) => (
            <div
              key={doc.id}
              className="p-6 bg-white border-2 border-gray-100 rounded-2xl dark:bg-gray-900/90 dark:border-gray-800 shadow-sm relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  Document {index + 1}
                </h3>

                {documents.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setDocuments((prev) => prev.filter((d) => d.id !== doc.id))
                    }
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Name of Document <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SSM Certificate"
                  className="w-full px-4 py-2.5 text-sm font-medium transition-all border-2 rounded-xl outline-none bg-white border-gray-200 text-gray-800 focus:border-[#F0CA8E] focus:ring-4 focus:ring-[#F0CA8E]/20 dark:bg-gray-900/90 dark:border-[#5c6185] dark:text-white dark:focus:border-[#F0CA8E] dark:focus:ring-[#3D405B]/40"
                  value={doc.name}
                  onChange={(e) => updateDoc(doc.id, { name: e.target.value })}
                />
              </div>

              <div
                onClick={() => document.getElementById(`file-${doc.id}`)?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDraggingId(doc.id);
                }}
                onDragLeave={() => setDraggingId(null)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setDraggingId(null);
                  await handleFile(doc.id, e.dataTransfer.files?.[0]);
                }}
                className={`relative group cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 flex items-center px-4 py-3 ${
                  draggingId === doc.id
                    ? "border-[#F0CA8E] bg-white shadow-lg ring-4 ring-[#F0CA8E]/20 dark:bg-gray-900/90 dark:border-[#F0CA8E]"
                    : doc.preview
                    ? "border-[#F0CA8E] bg-white dark:bg-gray-900/90 dark:border-[#F0CA8E]"
                    : "border-2 border-dashed border-gray-200 bg-white hover:border-[#F0CA8E]/50 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <input
                  id={`file-${doc.id}`}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={async (e) => await handleFile(doc.id, e.target.files?.[0])}
                />

                {doc.preview ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[250px]">
                      {doc.preview}
                    </span>
                    <span className="text-xs text-[#3D405B] dark:text-[#F0CA8E] font-semibold">
                      Change
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 w-full pointer-events-none">
                    <span className="text-sm font-medium text-gray-500">
                      Click or drag to upload (PDF, DOC, DOCX)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setDocuments((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  name: "",
                  preview: null,
                  fileName: null,
                  fileType: null,
                  fileBase64: null,
                },
              ])
            }
            className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-bold transition bg-transparent border-2 rounded-lg text-gray-700 border-gray-200 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            + Add another document
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={documents.some((d) => !d.name || !d.fileBase64)}
            className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-bold transition rounded-lg bg-[#3D405B] text-white hover:bg-[#2c2f42] disabled:bg-gray-200 disabled:text-gray-400"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}