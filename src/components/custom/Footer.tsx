import { useStrokesStore } from "@/store/strokesStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StylingPallete from "./StylingPallete";
import { Undo2, Redo2, Palette, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const Footer = () => {
  const { undoStroke, redoStroke, handleZoom, scale } = useStrokesStore();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-1 px-2  py-4 w-full select-none cursor-default z-10">
      <div className="flex gap-1 md:gap-1">
        <div className="flex gap-1 md:gap-1 items-center">
          <Button onClick={() => handleZoom(false)} variant="default">
            <ZoomOut className="w-4 h-4 bg-inherit" />
          </Button>
          <Button>{(scale * 100).toFixed(0)}%</Button>
          <Button onClick={() => handleZoom(true)}>
            <ZoomIn className="w-4 h-4 bg-inherit" />
          </Button>
        </div>
        <div className="flex gap-1 md:gap-4 items-center">
          <Button onClick={undoStroke} className="cursor-pointer">
            <Undo2 className="w-5 h-5 bg-inherit" />
          </Button>

          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger>
              <Button>
                <Palette className="w-5 h-5 bg-inherit" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <StylingPallete setIsPopoverOpen={setIsPopoverOpen} />
            </PopoverContent>
          </Popover>

          <Button onClick={redoStroke} className="cursor-pointer">
            <Redo2 className="w-5 h-5 bg-inherit" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
