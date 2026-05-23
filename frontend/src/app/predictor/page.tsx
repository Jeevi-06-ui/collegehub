"use client";

import { Calculator, Search, Trophy } from "lucide-react";
import { FormEvent, useState } from "react";
import { CollegeCard } from "@/components/colleges/college-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { usePredictor } from "@/hooks/use-predictor";
import { getApiErrorMessage } from "@/lib/api-client";
import type { Exam } from "@/lib/types";

const exams: Exam[] = ["KCET", "COMEDK", "JEE"];

export default function PredictorPage() {
  const [exam, setExam] = useState<Exam>("KCET");
  const [rank, setRank] = useState("");
  const predictor = usePredictor();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericRank = Number(rank);

    if (!numericRank || numericRank < 1) return;

    predictor.mutate({
      exam,
      rank: numericRank
    });
  };

  return (
    <div className="container-page">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-600">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-950">College predictor</h1>
          <p className="mt-1 text-slate-600">Choose an exam and enter your rank to find colleges where your rank fits the cutoff.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit shadow-sm">
          <CardHeader>
            <CardTitle>Predict colleges</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exam">Exam</Label>
                <Select id="exam" value={exam} onChange={(event) => setExam(event.target.value as Exam)}>
                  {exams.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rank">Rank</Label>
                <Input
                  id="rank"
                  type="number"
                  min={1}
                  placeholder="Example: 12000"
                  value={rank}
                  onChange={(event) => setRank(event.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={predictor.isPending || !rank}>
                <Search />
                {predictor.isPending ? "Predicting..." : "Get recommendations"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-5">
          {predictor.isError ? <ErrorState message={getApiErrorMessage(predictor.error)} /> : null}

          {!predictor.data && !predictor.isError ? (
            <EmptyState
              icon={Trophy}
              title="Your recommendations will appear here"
              description="The predictor uses college cutoff data from MongoDB and sorts matches by rating and placement strength."
            />
          ) : null}

          {predictor.data && predictor.data.data.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No colleges matched this rank"
              description="Try a different exam or a better rank value. Cutoffs vary by branch, category, and counselling round."
            />
          ) : null}

          {predictor.data?.data.length ? (
            <>
              <div className="rounded-lg border bg-white p-4 text-sm text-slate-600 shadow-sm">
                Found <span className="font-semibold text-slate-950">{predictor.data.total}</span> colleges for{" "}
                <span className="font-semibold text-slate-950">{predictor.data.exam}</span> rank{" "}
                <span className="font-semibold text-slate-950">{predictor.data.rank}</span>.
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {predictor.data.data.map((college) => (
                  <CollegeCard key={college._id} college={college} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
