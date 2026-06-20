import { Search, Sparkles } from "lucide-react";
import { useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { voicesSearchParams } from "@/features/voices/lib/params";
import { VoiceCreateDialog } from "@/features/voices/components/voice-create-dialog";

export function VoicesToolbar() {
  const [query, setQuery] = useQueryState("query", voicesSearchParams.query);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">All Libraries</h2>

      <p className="text-sm text-muted-foreground">Discover your voices, or make your own</p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <InputGroup className="lg:max-w-sm">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>

            <InputGroupInput
              placeholder="Search voices..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </InputGroup>

          <div className="ml-auto hidden lg:block">
            <VoiceCreateDialog>
              <Button size="sm">
                <Sparkles />
                Custom voice
              </Button>
            </VoiceCreateDialog>
          </div>

          <div className="lg:hidden">
            <VoiceCreateDialog>
              <Button size="sm" className="w-full">
                <Sparkles />
                Custom voice
              </Button>
            </VoiceCreateDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
