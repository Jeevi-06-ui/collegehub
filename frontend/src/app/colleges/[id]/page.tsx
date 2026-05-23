"use client";

import { Bookmark, BriefcaseBusiness, IndianRupee, MapPin, Star, TrendingUp, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CollegeCard } from "@/components/colleges/college-card";
import { CollegeGridSkeleton } from "@/components/colleges/college-card-skeleton";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollege } from "@/hooks/use-colleges";
import { useToggleSavedCollege } from "@/hooks/use-compare";
import { getApiErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatLocation, formatPackage } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CollegeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const collegeQuery = useCollege(params.id);
  const toggleSaved = useToggleSavedCollege();
  const college = collegeQuery.data?.college;
  const isSaved = user?.savedColleges?.some((savedCollege) => savedCollege._id === college?._id) ?? false;

  const handleSave = async () => {
    if (!college) return;

    if (!isAuthenticated) {
      toast.error("Login to save colleges");
      router.push("/login");
      return;
    }

    const response = await toggleSaved.mutateAsync(college._id);
    await refreshProfile();
    toast.success(response.saved ? "College saved" : "College removed");
  };

  if (collegeQuery.isLoading) {
    return (
      <div className="container-page">
        <Skeleton className="h-80 rounded-lg" />
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (collegeQuery.isError) {
    return (
      <div className="container-page">
        <ErrorState message={getApiErrorMessage(collegeQuery.error)} onRetry={() => collegeQuery.refetch()} />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="container-page">
        <EmptyState title="College not found" description="The requested college could not be loaded from the API." />
      </div>
    );
  }

  return (
    <div>
      <section className="relative border-b bg-slate-950 text-white">
        <div className="absolute inset-0">
          <Image src={college.image} alt={college.name} fill priority sizes="100vw" className="object-cover opacity-35" />
        </div>
        <div className="container relative py-12 md:py-16">
          <div className="max-w-4xl">
            <Badge className="bg-white text-blue-700 hover:bg-white">
              <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
              {college.rating.toFixed(1)} rated
            </Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-normal md:text-5xl">{college.name}</h1>
            <p className="mt-4 flex items-center gap-2 text-blue-50">
              <MapPin className="h-5 w-5" />
              {college.location.address}, {formatLocation(college.location)}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={handleSave} disabled={toggleSaved.isPending} variant={isSaved ? "secondary" : "default"}>
                <Bookmark className={cn(isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save college"}
              </Button>
              <Button variant="secondary" onClick={() => router.push(`/compare?college=${college._id}`)}>
                Compare
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
                <TabsTrigger value="placements">Placements</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-7 text-slate-700">{college.overview}</p>
                    <Separator className="my-5" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {college.courses.slice(0, 4).map((course) => (
                        <div key={course.name} className="rounded-md border bg-slate-50 p-4">
                          <p className="font-semibold text-slate-950">{course.name}</p>
                          <p className="mt-1 text-sm text-slate-600">{course.duration}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses">
                <Card>
                  <CardHeader>
                    <CardTitle>Courses offered</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {college.courses.map((course) => (
                      <div key={course.name} className="rounded-md border p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-950">{course.name}</h3>
                            <p className="mt-1 text-sm text-slate-600">{course.eligibility}</p>
                          </div>
                          <div className="text-sm font-semibold text-blue-700">{formatCurrency(course.fee)}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fees">
                <Card>
                  <CardHeader>
                    <CardTitle>Fee structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FeeItem label="KCET" value={college.feeStructure?.KCET} note="Karnataka colleges only" />
                      <FeeItem label="COMEDK" value={college.feeStructure?.COMEDK} note="Karnataka colleges only" />
                      <FeeItem label="JEE" value={college.feeStructure?.JEE} note="All supported colleges" />
                      <FeeItem label="Management quota" value={college.feeStructure?.management} note="Varies by college" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="placements">
                <Card>
                  <CardHeader>
                    <CardTitle>Placements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Stat icon={TrendingUp} label="Average package" value={formatPackage(college.placements.averagePackage)} />
                      <Stat icon={BriefcaseBusiness} label="Highest package" value={formatPackage(college.placements.highestPackage)} />
                    </div>
                    <div className="mt-5">
                      <h3 className="font-semibold text-slate-950">Top recruiters</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {college.placements.topRecruiters.map((recruiter) => (
                          <Badge key={recruiter} variant="secondary">
                            {recruiter}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {college.reviews.map((review) => (
                      <div key={`${review.userName}-${review.createdAt}`} className="rounded-md border p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-950">{review.userName}</p>
                          <Badge variant="success">
                            <Star className="mr-1 h-3 w-3 fill-current" />
                            {review.rating.toFixed(1)}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Stat icon={IndianRupee} label="Annual fees" value={formatCurrency(college.fees)} />
                <Stat icon={Star} label="Rating" value={`${college.rating.toFixed(1)}/5`} />
                <Stat icon={TrendingUp} label="Average package" value={formatPackage(college.placements.averagePackage)} />
              </CardContent>
            </Card>
          </aside>
        </div>

        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold text-slate-950">Similar colleges</h2>
          {collegeQuery.data?.similarColleges.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {collegeQuery.data.similarColleges.map((similarCollege) => (
                <CollegeCard key={similarCollege._id} college={similarCollege} compact />
              ))}
            </div>
          ) : (
            <CollegeGridSkeleton count={3} />
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <Icon className="mb-2 h-4 w-4 text-blue-600" />
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function FeeItem({ label, value, note }: { label: string; value?: number; note: string }) {
  return (
    <div className="rounded-md border bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value ? formatCurrency(value) : "Not applicable"}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}
