"use client";

import styles from "../form.module.css";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import Input from "../Input/Input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import {
  getBookPDFUrl,
  removeBookPDFUrl,
  uploadBookPDFUrl,
} from "@/lib/db/book";

export default function FileUploadModal({
  isOpen,
  onCancel,
  onDone,
  bookId,
  userId,
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [existingPDFUrl, setExistingPDFUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExistingPDF = async () => {
      if (!bookId) return;
      setIsLoading(true);
      const url = await getBookPDFUrl(bookId, userId);
      setExistingPDFUrl(url);
      setIsLoading(false);
    };

    if (isOpen) {
      fetchExistingPDF();
    }
  }, [isOpen, bookId]);

  const handleUpload = async (file, bookId) => {
    const fileExt = file.name.split(".").pop();
    const folderPath = `books/${bookId}/`;
    const filePath = `${folderPath}${Date.now()}.${fileExt}`;

    const { data: list, error: listError } = await supabase.storage
      .from("books-pdf")
      .list(folderPath, { limit: 100 });

    if (listError) {
      console.error("Error listing files:", listError);
      throw listError;
    }

    if (list && list.length > 0) {
      const filesToDelete = list.map((file) => `${folderPath}${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from("books-pdf")
        .remove(filesToDelete);

      if (deleteError) {
        console.error("Error deleting files:", deleteError);
        throw deleteError;
      }
    }

    let { data, error } = await supabase.storage
      .from("books-pdf")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("books-pdf")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const onSubmit = async (data) => {
    const file = data.file[0];
    try {
      const url = await handleUpload(file, bookId);
      await uploadBookPDFUrl(url, bookId, userId);
      onDone();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!existingPDFUrl) return;

    const filePath = existingPDFUrl.split(
      "/storage/v1/object/public/books-pdf/"
    )[1];
    const { error } = await supabase.storage
      .from("books-pdf")
      .remove([filePath]);

    if (error) {
      console.error("Error deleting file:", error);
      return;
    }

    await removeBookPDFUrl(bookId, userId);
    setExistingPDFUrl(null);
    onDone();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.textEditorFormContainer}>
        <div className={styles.messageContainer}>
          <h2>Upload Book PDF</h2>
          <p>
            Upload an existing PDF of a book or article to work with in your
            notes.
          </p>
          {existingPDFUrl && (
            <>
              {" "}
              <p>
                The PDF for the book already exists, you can replace or delete
                it:{" "}
                <a
                  href={existingPDFUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>
              </p>
              <button className={styles.cancel} onClick={handleDelete}>
                Delete PDF
              </button>
            </>
          )}
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {existingPDFUrl ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.noteForm}
              >
                <Input id="pdf" name="pdf" type="file" {...register("file")} />
                <MainButton type="submit" disabled={isSubmitting}>
                  Replace PDF
                </MainButton>

                <button className={styles.cancel} onClick={onCancel}>
                  Cancel
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.noteForm}
              >
                <Input id="pdf" name="pdf" type="file" {...register("file")} />
                <MainButton type="submit" disabled={isSubmitting}>
                  Upload PDF
                </MainButton>
                <button className={styles.cancel} onClick={onCancel}>
                  Cancel
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
