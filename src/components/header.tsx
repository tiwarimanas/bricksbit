import { Target } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            <h1 className="text-xl font-semibold tracking-tight">
              Habitual Harmony
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
