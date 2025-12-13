"use client";

import { Camera, ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  onImageSelect: (file: File) => void;
  isLoading?: boolean;
  selectedImage?: string | null;
  onClear?: () => void;
};

export function ImageUploader({
  onImageSelect,
  isLoading = false,
  selectedImage,
  onClear,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleUploadImg = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // Use "user" for front camera
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    };
    input.click();
  }, [onImageSelect]);

  // use camera functionality to take photo using browser's camera API
  const handleTakePhoto = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;

      // Create modal overlay
      const overlay = document.createElement("div");
      overlay.style.cssText =
        "position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;";

      video.style.cssText = "max-width:100%;max-height:70vh;border-radius:8px;";

      const captureBtn = document.createElement("button");
      captureBtn.textContent = "📷 Capture";
      captureBtn.style.cssText =
        "margin-top:20px;padding:12px 32px;font-size:18px;border-radius:9999px;border:none;background:linear-gradient(to right,#8b5cf6,#d946ef);color:white;cursor:pointer;";

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "✕ Cancel";
      closeBtn.style.cssText =
        "margin-top:12px;padding:8px 24px;font-size:14px;border-radius:9999px;border:1px solid #666;background:transparent;color:white;cursor:pointer;";

      overlay.appendChild(video);
      overlay.appendChild(captureBtn);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);

      const cleanup = () => {
        // biome-ignore lint/complexity/noForEach: <dont need>
        // biome-ignore lint/suspicious/useIterableCallbackReturn: <dont need>
        stream.getTracks().forEach((track) => track.stop());
        overlay.remove();
      };

      closeBtn.onclick = cleanup;

      captureBtn.onclick = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera-photo.jpg", {
                type: "image/jpeg",
              });
              onImageSelect(file);
            }
            cleanup();
          },
          "image/jpeg",
          0.9
        );
      };
    } catch (error) {
      console.error("Camera access denied:", error);
      // Fallback to file input with capture
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          onImageSelect(file);
        }
      };
      input.click();
    }
  }, [onImageSelect]);

  if (selectedImage) {
    return (
      <Card className="group relative overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Image
              alt="Selected food"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={selectedImage}
            />
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-3 h-12 w-12 animate-spin text-white" />
                  <p className="font-medium text-white">
                    Analyzing your meal...
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    Our AI is identifying ingredients
                  </p>
                </div>
              </div>
            ) : null}
            {!isLoading && onClear ? (
              <Button
                className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={onClear}
                size="icon"
                variant="destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "cursor-pointer border-2 border-dashed transition-all duration-300",
        isDragging
          ? "scale-[1.02] border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
      )}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardContent className="p-3">
        <label className="flex cursor-pointer flex-col items-center justify-center">
          <div className="relative mb-6">
            <div
              className={cn(
                "flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300",
                isDragging
                  ? "scale-110 bg-primary text-primary-foreground"
                  : "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
              )}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="-bottom-1 -right-1 absolute flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>

          <h3 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text font-semibold text-transparent text-xl">
            Upload Your Meal
          </h3>
          <p className="mb-6 max-w-sm text-center text-muted-foreground">
            Drag and drop an image or click to browse. Our AI will analyze the
            nutritional content instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              className="bg-linear-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
              onClick={handleUploadImg}
              variant="default"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
            <Button onClick={handleTakePhoto} variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>

          <input
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileInput}
            type="file"
          />

          <p className="mt-6 text-muted-foreground text-xs">
            Supports JPEG, PNG, WebP, GIF • Max 10MB
          </p>
        </label>
      </CardContent>
    </Card>
  );
}
