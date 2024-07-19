import { Loader2 } from "lucide-react";

export default function PipelineLoading() {
  return (
    <div className="-mt-8 h-screen">
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    </div>
  );
}
