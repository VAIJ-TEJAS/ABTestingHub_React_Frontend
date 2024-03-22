import { Container, Paper } from "@mui/material"
import { Button } from "antd"
import HeroImage from "../assets/images/hero-image.webp"
import { MostPopularArticleCard } from "../articles/components/MostPopularArticleCard";
import ContinuousMetricLogo from "../assets/images/ContinuousMetric.webp"
import ProportionalMetricLogo from "../assets/images/ProportionalMetric.webp"
import ABTestingLogo from "../assets/images/ABTesting.webp"

export const Home = () => {
  return (
    <>
      <div>
        <Container className="relative">
          <div className="space-y-8 py-16">
            <div className="text-7xl font-medium">Stay curious.</div>
            <div className="text-2xl w-1/2">Optimize Your Decisions: Uncover data-driven insights through controlled AB testing and elevate your business strategy.</div>
            <div>
              <Button
                size="large"
                type="primary"
                className="hidden lg:inline-block lg:ml-auto px-6 font-bold  transition duration-200"
              // onClick={showAuthModal}
              >
                Get Started
              </Button></div>
          </div>
          <img src={HeroImage} className="absolute right-0 top-0 h-full -z-50" />
        </Container>
      </div>
      {/* Tools  */}
      <div>
        <Container>
          <div className="gap-8 py-16">
            <div className="space-y-4">
              <div className="text-4xl font-medium py-8">
                Tools We Offer
              </div>
              <div className="flex justify-center gap-8">
                <div className=" border-primary border rounded-xl p-4">
                  <div className="pb-4 text-primary text-3xl font-mono">
                    MSS Tool
                  </div>
                  <div className="flex gap-8">
                    <Paper className="w-80 shadow p-4 space-y-2 hover:shadow-2xl cursor-pointer group">
                      <div>
                        <img src={ContinuousMetricLogo} className="rounded" />
                      </div>
                      <div className="">
                        <div className="text-xl font-medium group-hover:text-primary duration-200">
                          Continuous Metric Testing
                        </div>
                        <div className="text-zinc-500">
                          Measures how much of something there is, taking any value on a scale (e.g., how long users watch a video on average).
                        </div>
                      </div>
                    </Paper>

                    <Paper className="w-80 shadow p-4 space-y-2 hover:shadow-2xl cursor-pointer group">
                      <div>
                        <img src={ProportionalMetricLogo} className="rounded" />
                      </div>
                      <div className="">
                        <div className="text-xl font-medium group-hover:text-primary duration-200">
                          Proportional metric Testing
                        </div>
                        <div className="text-zinc-500">
                          Represents a fraction of a whole, expressed as a percentage or ratio (e.g., what portion of website visitors make a purchase).
                        </div>
                      </div>
                    </Paper>
                  </div>
                </div>
                <div className="border-red-600 border rounded-xl p-4">
                  <div className="pb-4 text-red-600 text-3xl font-mono">
                    AB Testing Tool
                  </div>
                  <div className="flex gap-8">
                    <Paper className="w-80 shadow p-4 space-y-2 hover:shadow-2xl cursor-pointer group">
                      <div>
                        <img src={ABTestingLogo} className="rounded" />
                      </div>
                      <div className="">
                        <div className="text-xl font-medium group-hover:text-primary duration-200">
                          AB testing Tool
                        </div>
                        <div className="text-zinc-500">
                          An experiment that compares two variations of something by randomly splitting users into groups and measuring which performs better.
                        </div>
                      </div>
                    </Paper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* Articles  */}
      <div>
        <Container>
          <div className="space-y-8 py-16">
            <div className="space-y-4">
              <div className="text-4xl font-medium py-8">
                Most Popular
              </div>
              <div className="gap-3 flex flex-wrap justify-center">
                <MostPopularArticleCard />
                <MostPopularArticleCard />
                <MostPopularArticleCard />
                <MostPopularArticleCard />
                <MostPopularArticleCard />
                <MostPopularArticleCard />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
