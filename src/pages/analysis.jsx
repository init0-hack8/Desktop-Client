"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/configs/firebase"
import Navbar from "@/components/Navbar/Navbar"
// Recharts components
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart
} from "recharts"
// Shadcn chart wrappers
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

function Analysis() {
  const { postId } = useParams()
  const [resultData, setResultData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!postId) return

    async function fetchResult() {
      setLoading(true)
      try {
        const q = query(collection(db, "result"), where("postId", "==", postId))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setResultData(doc.data())
        } else {
          console.warn('No matching "result" doc found for postId:', postId)
          setResultData(null)
        }
      } catch (error) {
        console.error("Error fetching analysis result:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [postId])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6">
          <p>Loading analysis...</p>
        </div>
      </>
    )
  }

  if (!resultData) {
    return (
      <>
        <Navbar />
        <div className="p-6">
          <p className="text-red-500">
            No analysis found for postId: {postId}
          </p>
        </div>
      </>
    )
  }

  // -------------------------------------------------------------------------
  // Destructure the "old" fields
  // -------------------------------------------------------------------------
  const {
    audience_demographics = {},          // existing
    cultural_seasonality = {},           // existing
    emotional_resonance,                // existing
    notes,                               // existing
    platform_engagement = {},           // existing
    public_reactions = [],              // existing
    recommendations = [],               // existing
    sentiment_distribution = {},        // existing
    trending_hashtags = [],             // existing
  } = resultData

  // -------------------------------------------------------------------------
  // Destructure the "new" fields
  // -------------------------------------------------------------------------
  const {
    analyzedAt,                          // string date/time
    audience_segmentation = {},          // map with e.g. 13-17, 18-25, 25-34, 35-50
    hashtag_intelligence = {},           // map with #NVIDIAMemes, #TechHumor, etc.
    platform_engagement_styles = {},     // map with instagram, linkedin, etc.
    post_strategy_summary = {},          // map with enhancement_needed, ideal_audience, ...
    recommended_actions = [],            // array of new recommended actions
    sentiment_summary = {},              // map with numeric fields: content_richness, emotional_impact...
  } = resultData

  // For Recharts RadarChart, we still parse sentiment_distribution as an object:
  // e.g. { negative: "10% (...)", neutral: "25% (...)", positive: "65% (...)", veryPositive: "67", ... }
  // These might be strings, so we can keep them as strings or parse out numbers if needed.
  const sentimentChartData = Object.entries(sentiment_distribution).map(([key, val]) => ({
    sentiment: key,
    value: val
  }))

  // We'll also do a second chart if you want to visualize sentiment_summary. 
  // e.g. { content_richness: 68, emotional_impact: 72, engagement_level: 65, topical_relevance: 55, virality_potential: 78 }
  // We'll transform it similarly:
  const summaryChartData = Object.entries(sentiment_summary).map(([key, val]) => ({
    metric: key,
    value: val
  }))

  // Chart config
  const chartConfig = {
    sentiment: {
      label: "Sentiment",
      color: "rgba(99, 102, 241, 1)",
    },
  }

  return (
    <>
      <Navbar />

      <div className="flex space-x-6 p-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Analyzed At (just display up top, if present) */}
          {analyzedAt && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Time</CardTitle>
                <CardDescription>
                  The post was analyzed at:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{analyzedAt}</p>
              </CardContent>
            </Card>
          )}

          {/* 1) Audience Demographics (existing) */}
          <div className="flex flex-col gap-4 md:flex-row">
            {Object.entries(audience_demographics).map(([ageRange, bulletPoints]) => (
              <Card key={ageRange} className="w-full md:w-1/3">
                <CardHeader>
                  <CardTitle>Age {ageRange}</CardTitle>
                  <CardDescription>Audience Insights</CardDescription>
                </CardHeader>
                <CardContent>
                  {Array.isArray(bulletPoints) && bulletPoints.map((bp, i) => (
                    <p key={i} className="text-sm mb-2">• {bp}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 2) Audience Segmentation (NEW) */}
          {/* This is a map with keys like 13-17, 18-25, 25-34, 35-50. Each has interest_keywords, likelihood, etc. */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Segmentation</CardTitle>
              <CardDescription>
                Breakdown by narrower age segments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(audience_segmentation).map(([segment, data]) => {
                // data might have interest_keywords (array), likelihood (string), ...
                const {
                  interest_keywords = [],
                  likelihood,
                  preferred_content = [],
                  reaction_type
                } = data
                return (
                  <div key={segment} className="border p-2 rounded-md">
                    <p className="font-semibold">
                      Age {segment} (Likelihood: {likelihood ?? 'N/A'})
                    </p>
                    <p className="text-sm mb-1">
                      Reaction Type: {reaction_type ?? 'N/A'}
                    </p>
                    {interest_keywords.length > 0 && (
                      <p className="text-sm mb-1">
                        <strong>Interests:</strong> {interest_keywords.join(', ')}
                      </p>
                    )}
                    {preferred_content.length > 0 && (
                      <p className="text-sm">
                        <strong>Prefers:</strong> {preferred_content.join(', ')}
                      </p>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* 3) Cultural Seasonality & Emotional Resonance */}
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle>Cultural Seasonality</CardTitle>
                <CardDescription>
                  {cultural_seasonality.active
                    ? "Currently in season"
                    : "Not in seasonal timeframe"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  Reason: {cultural_seasonality.reason}
                </p>
                {cultural_seasonality.regions && (
                  <div>
                    <p className="font-semibold text-sm">
                      Relevant Regions:
                    </p>
                    <ul className="list-disc list-inside text-sm pl-4">
                      {cultural_seasonality.regions.map((reg, i) => (
                        <li key={i}>{reg}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle>Emotional Resonance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Depth: {emotional_resonance ?? "N/A"} (out of 5)
                </p>
                <p className="text-sm mt-2">{notes}</p>
              </CardContent>
            </Card>
          </div>
          {/* 5) Platform Engagement Styles (NEW) */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Engagement Styles</CardTitle>
              <CardDescription>
                e.g. Instagram, LinkedIn, Reddit, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(platform_engagement_styles).map(([k, v]) => (
                <div key={k} className="border p-2 rounded-md">
                  <p className="font-semibold capitalize">{k}</p>
                  <p className="text-sm mt-1">{v}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 6) Public Reactions (existing) */}
          <Card>
            <CardHeader>
              <CardTitle>Public Reactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {public_reactions.map((reaction, i) => (
                <div
                  key={i}
                  className="p-2 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {reaction}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 7) Trending Hashtags (existing) */}
          {Array.isArray(trending_hashtags) && trending_hashtags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Trending Hashtags</CardTitle>
                <CardDescription className="text-sm">
                  Swipe horizontally
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 overflow-x-auto py-2">
                  {trending_hashtags.map((tagObj, i) => (
                    <div
                      key={i}
                      className="shrink-0 border rounded-md p-3 mx-1"
                    >
                      <p className="font-semibold">{tagObj.tag}</p>
                      <p className="text-sm mt-1">{tagObj.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 8) Hashtag Intelligence (NEW) */}
          {/* This is a map with e.g. #NVIDIAMemes -> { popularity, type }, etc. */}
          <Card>
            <CardHeader>
              <CardTitle>Hashtag Intelligence</CardTitle>
              <CardDescription>
                Additional hashtag insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(hashtag_intelligence).map(([hashtag, info]) => (
                <div
                  key={hashtag}
                  className="border p-2 rounded-md"
                >
                  <p className="font-semibold">{hashtag}</p>
                  {/* info might have { popularity, type } */}
                  <p className="text-sm mt-1">
                    Popularity: {info.popularity}
                  </p>
                  <p className="text-sm">
                    Type: {info.type}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6 w-[500px]">
          {/* 2) Sentiment Summary (Second Radar or Barchart) */}
          {summaryChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Summary</CardTitle>
                <CardDescription>Radar of content_richness, emotional_impact, etc.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto">
                  <RadarChart
                    data={summaryChartData}
                    width={400}
                    height={400}
                    outerRadius="70%"
                    margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
                  >
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarGrid />
                    <Radar
                      dataKey="value"
                      fill="var(--color-sentiment)"
                      fillOpacity={0.6}
                      dot={{ r: 4, fillOpacity: 1 }}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* 3) Post Strategy Summary (NEW) */}
          {post_strategy_summary && (
            <Card>
              <CardHeader>
                <CardTitle>Post Strategy Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {post_strategy_summary.enhancement_needed && (
                  <p className="text-sm">
                    <strong>Enhancement Needed:</strong> {post_strategy_summary.enhancement_needed}
                  </p>
                )}
                {Array.isArray(post_strategy_summary.ideal_audience) && (
                  <p className="text-sm">
                    <strong>Ideal Audience:</strong>{" "}
                    {post_strategy_summary.ideal_audience.join(", ")}
                  </p>
                )}
                {post_strategy_summary.seasonal_fit && (
                  <p className="text-sm">
                    <strong>Seasonal Fit:</strong> {post_strategy_summary.seasonal_fit}
                  </p>
                )}
                {post_strategy_summary.should_post_now && (
                  <p className="text-sm">
                    <strong>Should Post Now?:</strong>{" "}
                    {post_strategy_summary.should_post_now}
                  </p>
                )}
                {post_strategy_summary.status && (
                  <p className="text-sm">
                    <strong>Status:</strong> {post_strategy_summary.status}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* 4) Additional recommended_actions (NEW) */}
          {/* Different from the old "recommendations" if you want them separate */}
          {recommended_actions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recommended_actions.map((action, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {action}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

export default Analysis
