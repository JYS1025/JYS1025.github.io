import { Hero } from "@/components/sections/hero";
import { RecentPosts } from "@/components/sections/recent-posts";
import { TopicLinks } from "@/components/sections/topic-links";

export default function Home() {
  return (
    <div className="container mx-auto px-6 pt-4 pb-6 md:pt-8 md:pb-12 lg:pt-8 lg:pb-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
        {/* Left Column: Intro/Bio */}
        <div className="flex flex-col lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:justify-center pb-12 lg:pb-0">
          <Hero align="left" />
        </div>

        {/* Right Column: Blog & Topics */}
        <div className="space-y-12">
          <TopicLinks />
          <RecentPosts />
        </div>
      </div>
    </div>
  );
}
