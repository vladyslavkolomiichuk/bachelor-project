import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ZoomIn,
  ZoomOut,
  TextCursor,
  SquareDashedMousePointer,
  Check,
  BookmarkCheck,
} from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import styles from "./file-viewer.module.css";
import { useToast } from "@/context/ToastContext";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function FileViewer({
  fileUrl,
  onTextSelect,
  isUpdateNote = false,
}) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.5);
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRangeSelectionMode, setIsRangeSelectionMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [bookmarkPage, setBookmarkPage] = useState(null);
  const [pagesRendered, setPagesRendered] = useState({});

  const viewerRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    const preventBrowserZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    document.addEventListener("wheel", preventBrowserZoom, { passive: false });
    return () => {
      document.removeEventListener("wheel", preventBrowserZoom);
    };
  }, []);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY;
      const zoomFactor = 0.1;
      setScale((currentScale) => {
        const newScale =
          delta > 0
            ? Math.max(0.5, currentScale - zoomFactor)
            : Math.min(3, currentScale + zoomFactor);
        return newScale;
      });
    }
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);

    if (fileUrl) {
      const savedPage = localStorage.getItem(`pdf-last-page-${fileUrl}`);
      if (savedPage) {
        setBookmarkPage(savedPage);
      }
    }
  }

  const handleTextSelection = () => {
    if (!isRangeSelectionMode) return;

    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text) {
      setSelectedText(text);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedText) {
      onTextSelect?.(selectedText);
      setSelectedText("");
      window.getSelection()?.removeAllRanges();
      showToast("Read text successfully highlighted", "success");
    }
  };

  useEffect(() => {
    const loadPDF = async () => {
      if (!fileUrl) return;
      try {
        setLoading(true);
        setPdfData({ url: fileUrl });
      } catch (err) {
        console.error("Error loading PDF:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPDF();
  }, [fileUrl]);

  const handlePageRenderSuccess = (pageNumber) => {
    setPagesRendered((prev) => ({ ...prev, [pageNumber]: true }));
  };

  useEffect(() => {
    if (!fileUrl || !numPages || !bookmarkPage) return;

    if (pagesRendered[bookmarkPage]) {
      const el = document.querySelector(`[data-page-number="${bookmarkPage}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [fileUrl, numPages, bookmarkPage, pagesRendered]);

  const handleSaveBookmark = () => {
    if (!viewerRef.current) return;

    const pages = viewerRef.current.querySelectorAll("[data-page-number]");
    let mostVisiblePage = null;
    let maxVisibleArea = 0;

    pages.forEach((page) => {
      const rect = page.getBoundingClientRect();
      const visibleArea = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      );

      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        mostVisiblePage = page;
      }
    });

    if (mostVisiblePage) {
      const pageNumber = mostVisiblePage.getAttribute("data-page-number");
      localStorage.setItem(`pdf-last-page-${fileUrl}`, pageNumber);
      setBookmarkPage(pageNumber);
      showToast(`Saved bookmark on page ${pageNumber}`, "success");
    }
  };

  if (loading) return <div className={styles.loading}>Loading PDF...</div>;
  if (!pdfData && !loading) {
    showToast("There is no PDF in this book", "warning");
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.scaleContainer}>
          <button
            onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
            className={styles.toolbarButton}
            disabled={scale <= 0.5}
          >
            <ZoomOut />
          </button>
          <span className={styles.scale}>{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((prev) => Math.min(3, prev + 0.2))}
            className={styles.toolbarButton}
            disabled={scale >= 3}
          >
            <ZoomIn />
          </button>
        </div>

        <div className={styles.divider} />

        <button
          onClick={handleSaveBookmark}
          className={styles.toolbarButton}
          title="Save bookmark"
        >
          <BookmarkCheck />
        </button>

        {bookmarkPage && (
          <div className={styles.bookmarkIndicator}>Page: {bookmarkPage}</div>
        )}

        {!isUpdateNote && (
          <>
            <div className={styles.divider} />
            <button
              onClick={() => {
                setIsRangeSelectionMode((prev) => !prev);
                setSelectedText("");
                window.getSelection()?.removeAllRanges();
              }}
              className={`${styles.toolbarButton} ${
                isRangeSelectionMode ? styles.active : ""
              }`}
            >
              {isRangeSelectionMode ? (
                <SquareDashedMousePointer />
              ) : (
                <TextCursor />
              )}
            </button>
          </>
        )}

        {isRangeSelectionMode && selectedText && (
          <>
            <div className={styles.divider} />
            <button
              onClick={handleConfirmSelection}
              className={styles.toolbarButton}
            >
              <Check />
            </button>
          </>
        )}
      </div>

      <div
        ref={viewerRef}
        className={styles.viewerContainer}
        onMouseUp={handleTextSelection}
        onWheel={handleWheel}
      >
        <Document
          file={pdfData}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className={styles.loading}>Loading PDF...</div>}
          className={styles.document}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={`page_${index + 1}`}
              className={`${styles.pageWrapper} ${
                bookmarkPage == index + 1 ? styles.bookmarkedPage : ""
              }`}
              data-page-number={index + 1}
            >
              <Page
                pageNumber={index + 1}
                scale={scale}
                className={styles.page}
                loading={<div className={styles.loading}>Loading page...</div>}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                onRenderSuccess={() => handlePageRenderSuccess(index + 1)}
                onRenderError={(error) => {
                  if (error.name === "AbortException") return;
                  console.error("Page render error:", error);
                }}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
