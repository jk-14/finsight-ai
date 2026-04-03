import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const InsightSkeleton = () => (
  <Card>
    <CardHeader className="pb-3">
      <Skeleton className="h-5 w-40" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-4/6" />
    </CardContent>
  </Card>
);
