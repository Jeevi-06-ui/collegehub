"use client";

import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAnswerQuestion, useQuestion } from "@/hooks/use-questions";
import { getApiErrorMessage } from "@/lib/api-client";

export default function DiscussionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const questionQuery = useQuestion(params.id);
  const answerQuestion = useAnswerQuestion(params.id);

  const handleAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Login to answer");
      router.push(`/login?next=/discussions/${params.id}`);
      return;
    }

    await answerQuestion.mutateAsync({ id: params.id, text });
    setText("");
  };

  if (questionQuery.isLoading) {
    return (
      <div className="container-page">
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (questionQuery.isError) {
    return (
      <div className="container-page">
        <ErrorState message={getApiErrorMessage(questionQuery.error)} onRetry={() => questionQuery.refetch()} />
      </div>
    );
  }

  const question = questionQuery.data?.question;

  if (!question) {
    return (
      <div className="container-page">
        <EmptyState title="Discussion not found" description="This discussion could not be loaded." />
      </div>
    );
  }

  return (
    <div className="container-page">
      <Button variant="ghost" asChild className="mb-5">
        <Link href="/discussions">
          <ArrowLeft />
          Back to discussions
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl leading-tight">{question.title}</CardTitle>
              <p className="text-sm text-slate-500">
                Asked by {question.user.name} on {new Date(question.createdAt).toLocaleDateString("en-IN")}
              </p>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-slate-700">{question.description}</p>
            </CardContent>
          </Card>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-950">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Answers
            </h2>

            {question.answers.length ? (
              <div className="space-y-3">
                {question.answers.map((answer) => (
                  <Card key={answer._id}>
                    <CardContent className="p-5">
                      <p className="leading-7 text-slate-700">{answer.text}</p>
                      <p className="mt-4 text-xs text-slate-500">
                        Answered by {answer.user.name} on {new Date(answer.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="No answers yet" description="Be the first to answer this student question." />
            )}
          </section>
        </div>

        <Card className="h-fit shadow-sm">
          <CardHeader>
            <CardTitle>Write an answer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnswer} className="space-y-4">
              <Textarea value={text} onChange={(event) => setText(event.target.value)} minLength={3} required />
              <Button type="submit" className="w-full" disabled={answerQuestion.isPending || !text.trim()}>
                <Send />
                {answerQuestion.isPending ? "Posting..." : "Post answer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
