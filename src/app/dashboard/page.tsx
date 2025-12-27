'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, BookOpen, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const quizScoresQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/quizScores`);
  }, [firestore, user]);

  const learningProgressQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/learningProgress`);
  }, [firestore, user]);


  const { data: quizScores, isLoading: scoresLoading } = useCollection(quizScoresQuery);
  const { data: learningProgress, isLoading: progressLoading } = useCollection(learningProgressQuery);

  const completedTopics = learningProgress?.filter((p) => p.completed).length || 0;
  const timeSpent = learningProgress?.reduce((acc, p) => acc + (p.timeSpent || 0), 0) || 0;

  const chartData = quizScores?.map(score => ({
    name: score.quizId,
    score: score.score,
  })) || [];

  if (isUserLoading || !user || scoresLoading || progressLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="w-full max-w-4xl p-8 space-y-8">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }
  
  const getNextTopic = () => {
    const allTopics = ['Arrays', 'Strings', 'Linked Lists', 'Trees'];
    const completed = learningProgress?.filter(p => p.completed).map(p => p.topicId) || [];
    return allTopics.find(t => !completed.includes(t)) || 'All topics completed!';
  }

  return (
    <main className="flex min-h-screen w-full flex-col bg-background">
       <header className="bg-card shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <Link href="/" passHref>
          <Button variant="outline">Back to Learning</Button>
        </Link>
      </header>
      <div className="flex-1 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.displayName || user.email}!</CardTitle>
            <CardDescription>Here's a summary of your learning journey.</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Topics Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTopics}</div>
              <p className="text-xs text-muted-foreground">Keep up the great work!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeSpent} min</div>
              <p className="text-xs text-muted-foreground">Estimated learning time</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">"Array Architect" Badge</p>
            </CardContent>
          </Card>
           <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Topic Suggestion</CardTitle>
              <Target className="h-4 w-4 text-primary-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getNextTopic()}</div>
               <p className="text-xs text-primary-foreground/80">Based on your progress</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
            <CardDescription>Your scores across different topics.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                <Legend />
                <Bar dataKey="score" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      </div>
    </main>
  );
}

    