"use client";

import { MessageSquare, Plus, Search } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/colleges/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCreateQuestion, useQuestions } from "@/hooks/use-questions";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/lib/api-client";

export default function DiscussionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const questionsQuery = useQuestions({ search: debouncedSearch, page, limit: 8 });
  const createQuestion = useCreateQuestion();

  const handleAsk = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Login to ask a question");
      router.push("/login?next=/discussions");
      return;
    }

    const response = await createQuestion.mutateAsync({ title, description });
    setTitle("");
    setDescription("");
    router.push(`/discussions/${response.question._id}`);
  };

  return (
    <div className="container-page">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Discussions</h1>
          <p className="mt-1 text-slate-600">Ask questions, answer students, and browse college decision threads.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit shadow-sm">
          <CardHeader>
            <CardTitle>Ask a question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAsk} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} minLength={8} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  minLength={20}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={createQuestion.isPending}>
                <Plus />
                {createQuestion.isPending ? "Posting..." : "Post question"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search discussions"
              className="pl-9"
            />
          </div>

          {questionsQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          ) : null}

          {questionsQuery.isError ? (
            <ErrorState message={getApiErrorMessage(questionsQuery.error)} onRetry={() => questionsQuery.refetch()} />
          ) : null}

          {questionsQuery.data && questionsQuery.data.data.length === 0 ? (
            <EmptyState title="No discussions found" description="Try another search or start the first discussion." />
          ) : null}

          {questionsQuery.data?.data.map((question) => (
            <Link key={question._id} href={`/discussions/${question._id}`} className="block">
              <Card className="transition hover:-translate-y-0.5 hover:shadow-soft">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">{question.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{question.description}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                      {question.answers.length} answers
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Asked by {question.user.name} on {new Date(question.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {questionsQuery.data ? <Pagination pagination={questionsQuery.data.pagination} onPageChange={setPage} /> : null}
        </div>
      </div>
    </div>
  );
}
