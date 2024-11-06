import React, { useCallback, useEffect } from "react";
import { useStrokesStore } from "@/store/strokesStore";
import { Mode, ModeEnum } from "@/lib/utils";
import {
  Pencil,
  Type,
  Eraser,
  Move,
  MousePointer,
  Download,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModeConfig {
  mode: Mode;
  icon: LucideIcon;
  cursorStyle: string;
  label: string;
  shortcut: string;
  disabled?: boolean;
}

const modeConfigs: ModeConfig[] = [
  {
    mode: ModeEnum.DRAW,
    icon: Pencil,
    cursorStyle: "crosshair",
    label: "Draw",
    shortcut: "1",
  },
  {
    mode: ModeEnum.WRITE,
    icon: Type,
    cursorStyle: "text",
    label: "Write",
    shortcut: "2",
    // disabled: true,
  },
  {
    mode: ModeEnum.ERASE,
    icon: Eraser,
    cursorStyle: "pointer",
    label: "Erase",
    shortcut: "3",
  },
  {
    mode: ModeEnum.SCROLL,
    icon: Move,
    cursorStyle: "grab",
    label: "Move",
    shortcut: "4",
  },
  {
    mode: ModeEnum.CURSOR,
    icon: MousePointer,
    cursorStyle: "default",
    label: "Select",
    shortcut: "5",
  },
];

const ModeButton: React.FC<{
  config: ModeConfig;
  isActive: boolean;
  onClick: () => void;
}> = ({ config, isActive, onClick }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          onClick={onClick}
          // disabled={config.disabled}
          className="rounded-lg border shadow-none h-10"
        >
          <config.icon className="w-4 h-4 mr-[2px] md:mr-1 bg-inherit" />
          
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {config.label} (Press {config.shortcut})
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Toolbar: React.FC = () => {
  const { updateMode, mode, updateCursorStyle, downloadImage } =
    useStrokesStore();
  const { toast } = useToast();

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === "TEXTAREA") return;

      const config = modeConfigs.find((c) => c.mode === newMode);
      if (config) {
        updateMode(config.mode);
        updateCursorStyle(config.cursorStyle);
      }

      // if (newMode === ModeEnum.WRITE) {
      //   toast({
      //     variant: "destructive",
      //     title: "Text mode is coming soon!",
      //     duration: 1000,
      //   });
      // }
    },
    [updateMode, updateCursorStyle, toast]
  );

  const handleDownload = () => {
    downloadImage((message: string) =>
      toast({
        variant: "destructive",
        title: message,
        duration: 1000,
      })
    );
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const config = modeConfigs.find((c) => c.shortcut === event.key);
      if (config && !config.disabled) {
        handleModeChange(config.mode);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleModeChange]);

  return (
    <nav className="flex items-center shadow-lg gap-2 p-2 z-10">
      <ul className="flex items-center gap-2 rounded-lg p-1 max-w-full flex-wrap">
        {modeConfigs.map((config, index) => (
          <li key={config.mode} className="relative">
            <ModeButton
              config={config}
              isActive={mode === config.mode}
              onClick={() => handleModeChange(config.mode)}
            />
            <span className="absolute bottom-0 right-0 text-xs text-gray-400">
              {index + 1}
            </span>
          </li>
        ))}
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center h-8 w-8 rounded-lg bg-transparent hover:bg-gray-200"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Download Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>
    </nav>
  );
};

export default Toolbar;
