"use client";

import { Bookmark, IndianRupee, MapPin, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToggleSavedCollege } from "@/hooks/use-compare";
import { formatCurrency, formatLocation, formatPackage } from "@/lib/format";
import type { CollegeSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type CollegeCardProps = {
  college: CollegeSummary;
  compact?: boolean;
};

export function CollegeCard({ college, compact = false }: CollegeCardProps) {
  const router = useRouter();
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const toggleSaved = useToggleSavedCollege();
  const isSaved = user?.savedColleges?.some((savedCollege) => savedCollege._id === college._id) ?? false;

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Login to save colleges");
      router.push("/login");
      return;
    }

    const response = await toggleSaved.mutateAsync(college._id);
    await refreshProfile();
    toast.success(response.saved ? "College saved" : "College removed");
  };

  return (
    <Card className="group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={college.image}
          alt={college.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="bg-white/95 text-slate-800 shadow-sm">
            <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
            {college.rating.toFixed(1)}
          </Badge>
        </div>
      </div>

      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/colleges/${college._id}`} className="line-clamp-2 font-semibold text-slate-950 hover:text-blue-700">
              {college.name}
            </Link>
            <p className="mt-2 flex items-center gap-1 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-blue-600" />
              {formatLocation(college.location)}
            </p>
          </div>
          <Button
            variant={isSaved ? "default" : "outline"}
            size="icon"
            onClick={handleSave}
            disabled={toggleSaved.isPending}
            aria-label={isSaved ? "Remove saved college" : "Save college"}
          >
            <Bookmark className={cn(isSaved && "fill-current")} />
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-md bg-slate-50 p-2">
            <IndianRupee className="mb-1 h-4 w-4 text-blue-600" />
            <p className="text-xs text-slate-500">Fees</p>
            <p className="truncate font-semibold text-slate-950">{formatCurrency(college.fees)}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-2">
            <TrendingUp className="mb-1 h-4 w-4 text-blue-600" />
            <p className="text-xs text-slate-500">Average</p>
            <p className="font-semibold text-slate-950">{formatPackage(college.placements.averagePackage)}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-2">
            <Star className="mb-1 h-4 w-4 text-blue-600" />
            <p className="text-xs text-slate-500">Rating</p>
            <p className="font-semibold text-slate-950">{college.rating.toFixed(1)}/5</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {college.courses.slice(0, 3).map((course) => (
            <Badge key={course.name} variant="outline" className="font-normal text-slate-600">
              {course.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
