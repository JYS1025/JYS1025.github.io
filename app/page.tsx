import { Hero } from "@/components/sections/hero";
import { RecentPosts } from "@/components/sections/recent-posts";
import { TopicLinks } from "@/components/sections/topic-links";

export default function Home() {
  return (
    <div className="container mx-auto pt-4 pb-6 md:pt-8 md:pb-12 lg:pt-8 lg:pb-16">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-start">
        {/* Left Column: Intro/Bio */}
        <div className="flex flex-col lg:sticky lg:top-24">
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
