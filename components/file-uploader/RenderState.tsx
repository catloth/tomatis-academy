import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Arraste e solte arquivos aqui ou <span className="text-primary font-bold cursor-pointer">clique para selecionar o arquivo para upload</span>.
      </p>
      <Button className="mt-4">
        Selecionar Arquivo
      </Button>
    </div>
  )
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold">O upload falhou.</p>
      <p className="text-xs mt-1 text-muted-foreground">Ocorreu um erro durante o upload do arquivo.</p>
      <Button className="mt-4" type="button">Tentar novamente</Button>
    </div>
  )
}

export function RenderUploadedState({ 
  previewUrl, 
  isDeleting, 
  handleRemoveFile,
  fileType,
}: { 
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: "image" | "video";
}) {
  return (
    <div className="relative group w-full h-full flex items-center">
      {fileType === "video"? (
        <video src={previewUrl} controls className="rounded-md w-full h-full" />
      ) : (
        <Image 
          src={previewUrl} 
          alt="Arquivo enviado" 
          fill 
          className="object-contain p-2" 
        />
      )}

      <Button 
        variant="destructive" 
        size="icon" 
        className={cn("absolute top-4 right-4")}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  )
}

export function RenderUploadingState({
  progress, 
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <p>{progress}</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
    </div>
  )
}