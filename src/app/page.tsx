import { Header } from '@/components/layout/Header';
import { PostGenerator } from '@/components/post-generator/PostGenerator';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <PostGenerator />
      </main>
    </div>
  );
}
