import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>KT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Kidus Tiliksew</p>
          <p className="text-sm text-muted-foreground">Addis Ababa</p>
        </div>
        <div className="ml-auto font-medium">+ETB1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Abebe Kebede</p>
          <p className="text-sm text-muted-foreground">Addis Ababa</p>
        </div>
        <div className="ml-auto font-medium">+ETB39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>ET</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ephrem Tadesse</p>
          <p className="text-sm text-muted-foreground">Addis Ababa</p>
        </div>
        <div className="ml-auto font-medium">+ETB299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>NS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Nebiyu Samuel</p>
          <p className="text-sm text-muted-foreground">Addis Ababa</p>
        </div>
        <div className="ml-auto font-medium">+ETB99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Yonas Yishak</p>
          <p className="text-sm text-muted-foreground">Addis Ababa</p>
        </div>
        <div className="ml-auto font-medium">+ETB39.00</div>
      </div>
    </div>
  );
}
