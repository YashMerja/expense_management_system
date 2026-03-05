"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import Image from "next/image";

interface FileViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string | null;
    fileName?: string;
}

export function FileViewerModal({
    isOpen,
    onClose,
    fileUrl,
    fileName = "File Viewer",
}: FileViewerModalProps) {
    if (!fileUrl) return null;

    const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);

    // Helper to get filename from URL if not provided
    const displayFileName = fileName || fileUrl.split("/").pop() || "File";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="max-w-4xl w-full h-[80vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <DialogHeader className="p-4 flex flex-row items-center justify-between border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <DialogTitle className="text-lg font-semibold truncate flex-1 mr-4">
                        {displayFileName}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(fileUrl, "_blank")}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950 relative flex items-center justify-center p-4">
                    {isImage ? (
                        <div className="relative w-full h-full min-h-[300px]">
                            <Image
                                src={fileUrl}
                                alt={displayFileName}
                                fill
                                className="object-contain"
                                unoptimized // Prepare for external URLs if needed
                            />
                        </div>
                    ) : isPdf ? (
                        <object
                            data={fileUrl}
                            type="application/pdf"
                            className="w-full h-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white"
                        >
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-neutral-900">
                                <p className="mb-4 text-neutral-500 dark:text-neutral-400">
                                    Unable to display PDF directly.
                                </p>
                                <Button onClick={() => window.open(fileUrl, "_blank")}>
                                    Download to View
                                </Button>
                            </div>
                        </object>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                            <p className="mb-4 text-neutral-500 dark:text-neutral-400">
                                This file type cannot be previewed directly.
                            </p>
                            <Button onClick={() => window.open(fileUrl, "_blank")}>
                                Download to View
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
