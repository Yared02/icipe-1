import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentGrants() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">
            Community Development Grant
          </p>
          <p className="text-sm text-muted-foreground">Jun 7, 2024</p>
        </div>
        <div className="ml-auto font-medium">+ETB 500,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">
            Community Development Grant 2
          </p>
          <p className="text-sm text-muted-foreground">Jun 7, 2024</p>
        </div>
        <div className="ml-auto font-medium">+ETB 430,999.00</div>
      </div>
    </div>
  );
}
