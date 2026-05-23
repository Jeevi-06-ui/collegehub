"use client";

import { Bookmark, CalendarDays, Scale } from "lucide-react";
import Link from "next/link";
import { CollegeCard } from "@/components/colleges/college-card";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatPackage } from "@/lib/format";
import { useAuth } from "@/components/providers/auth-provider";

export default function SavedPage() {
  return (
    <ProtectedRoute>
      <SavedContent />
    </ProtectedRoute>
  );
}

function SavedContent() {
  const { user } = useAuth();
  const savedColleges = user?.savedColleges || [];
  const savedComparisons = user?.savedComparisons || [];

  return (
    <div className="container-page space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Saved colleges</h1>
        <p className="mt-2 text-slate-600">{savedColleges.length} colleges in your shortlist</p>
      </div>

      {savedColleges.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {savedColleges.map((college) => (
            <CollegeCard key={college._id} college={college} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved colleges yet"
          description="Save colleges from listings or details to keep your shortlist ready."
          action={{
            label: "Browse colleges",
            onClick: () => {
              window.location.href = "/colleges";
            }
          }}
        />
      )}

      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Saved comparisons</h2>
            <p className="mt-1 text-sm text-slate-600">{savedComparisons.length} comparison sets saved</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/compare">
              <Scale />
              Compare
            </Link>
          </Button>
        </div>

        {savedComparisons.length ? (
          <div className="grid gap-4">
            {savedComparisons.map((comparison) => (
              <Card key={comparison._id}>
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>{comparison.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit">
                      <CalendarDays className="mr-1 h-3 w-3" />
                      {new Date(comparison.createdAt).toLocaleDateString("en-IN")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-[680px] w-full text-sm">
                      <thead>
                        <tr className="border-b bg-slate-50 text-left">
                          <th className="p-3 font-semibold text-slate-700">College</th>
                          <th className="p-3 font-semibold text-slate-700">Fees</th>
                          <th className="p-3 font-semibold text-slate-700">Rating</th>
                          <th className="p-3 font-semibold text-slate-700">Average package</th>
                          <th className="p-3 font-semibold text-slate-700">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparison.snapshot.map((item) => (
                          <tr key={`${comparison._id}-${item.college}`} className="border-b last:border-b-0">
                            <td className="p-3 font-medium text-slate-950">{item.name}</td>
                            <td className="p-3 text-slate-700">{formatCurrency(item.fees)}</td>
                            <td className="p-3 text-slate-700">{item.rating.toFixed(1)}/5</td>
                            <td className="p-3 text-slate-700">{formatPackage(item.averagePackage)}</td>
                            <td className="p-3 text-slate-700">{item.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState icon={Scale} title="No saved comparisons" description="Compare two or three colleges and save the table here." />
        )}
      </section>
    </div>
  );
}
