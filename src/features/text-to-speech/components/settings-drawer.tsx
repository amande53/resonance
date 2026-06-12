import { Settings } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Drawer, 
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { SettingsPanelSettings } from "@/features/text-to-speech/components/settings-panel-settings"

interface SettingsDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function SettingsDrawer({
  open,
  onOpenChange,
  children
}: SettingsDrawerProps) {

  return (
    <Drawer open ={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm">
            <Settings className="size-4" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <SettingsPanelSettings/>
        </div>
      </DrawerContent>
      
    </Drawer>
  );
}
