// import styled from "../css/PrivacyPolicy.css";
import { Container } from "@mui/material";
import ContinuousMetricLogo from "../assets/images/ContinuousMetric.png";
import ProportionalMetricLogo from "../assets/images/ProportionalMetric.png";
import ABTestingLogo from "../assets/images/ABTesting.png";
import Ease from "../assets/svgs/Ease.svg";
import Analytics from "../assets/svgs/Analytics.svg";
import Feedback from "../assets/svgs/Feedback.svg";

export const AboutUs = () => {
  return (
    <div className="py-8">
      <Container className="no-tailwind">
        <div className="text-primary text-4xl pt-6 text-center">About Us</div>
        <p>
          At AB Testing Hub, we are dedicated to empowering businesses with the
          tools and knowledge needed to make data-driven decisions. Our mission
          is to simplify the complex world of AB testing, making it accessible
          and effective for companies of all sizes.
        </p>

        <div className="text-primary text-3xl pt-6">Our Mission</div>
        <p>
          Our mission is to democratize AB testing by providing user-friendly
          tools and insightful resources. We strive to help businesses optimize
          their digital experiences, leading to better customer satisfaction and
          calculate conversion rates. We believe in the power of data to drive
          innovation and growth.
        </p>

        {/* <div className="text-primary text-3xl pt-6">Our Story</div>
        <p>
          AB Testing Hub was founded in January 2024 with a vision to bridge the
          gap between data science and business decision-making. Our founder,
          Mr. Anurag Deyasi, recognized the challenges businesses face in
          implementing effective AB testing strategies. Over the years, we have
          developed a suite of tools that are not only powerful but also easy to
          use, ensuring that everyone, from startups to large enterprises, can
          benefit from AB testing.
        </p> */}

        {/* <div className="text-primary text-3xl pt-6">Our Team</div>
        <div>TEAM CONTENT</div> */}

        <div className="text-primary text-3xl pt-8">What We Do</div>
        <div className="py-6">
          <div className="flex justify-between gap-8">
            <div className="rounded-xl">
              <div
                style={{
                  boxShadow: "0px 15px 20px 0px #00000040 ",
                  border: "2px solid #07617d",
                }}
                className="bg-white w-80 space-y-2 cursor-pointer rounded-xl border-secondary border-2"
              >
                <div className="p-2">
                  <img
                    src={ContinuousMetricLogo}
                    className="rounded-xl w-full h-60"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-2xl text-secondary">
                    Continuous Metric Testing
                  </div>
                  <div className="text-[#2E383F] pt-4">
                    Measures how much of something there is, taking any value on
                    a scale (e.g., how long users watch a video on average).
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl">
              <div
                style={{
                  boxShadow: "0px 15px 20px 0px #00000040 ",
                  border: "2px solid #07617d",
                }}
                className="bg-white w-80 space-y-2 cursor-pointer rounded-xl border-secondary border-2"
              >
                <div className="p-2">
                  <img
                    src={ProportionalMetricLogo}
                    className="rounded-xl bg-cover w-full h-60"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-2xl text-secondary">
                    Proportional metric Testing
                  </div>
                  <div className="text-[#2E383F] pt-4">
                    Represents a fraction of a whole, expressed as a percentage
                    or ratio (e.g., what portion of website visitors make a
                    purchase).
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl">
              <div
                style={{
                  boxShadow: "0px 15px 20px 0px #00000040 ",
                  border: "2px solid #07617d",
                }}
                className="bg-white w-80 space-y-2 cursor-pointer rounded-xl border-2"
              >
                <div className="p-2">
                  <img
                    src={ABTestingLogo}
                    className="rounded-xl bg-cover w-full h-60"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-2xl text-secondary">
                    A/B Testing Tool (Variant Testing)
                  </div>
                  <div className="text-[#2E383F] pt-4">
                    An experiment that compares two variations of something by
                    randomly splitting users into groups.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-primary text-3xl pt-8">Why Choose Us</div>
        <div className="py-6">
        <div className="flex justify-between gap-8">
            <div className="rounded-xl">
              <div
                style={{
                  boxShadow: "0px 15px 20px 0px #00000040 ",
                  border: "2px solid #07617d",
                }}
                className="bg-white w-80 space-y-2 cursor-pointer rounded-xl border-secondary border-2"
              >
                <div className="p-2">
                  <img
                    src={Ease}
                    className="rounded-xl w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-2xl text-secondary">
                  Simple and Accessible Platform
                  </div>
                  <div className="text-[#2E383F] pt-4">
                  Our tools are intuitive and user-friendly, ensuring the accessibility to everyone.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl">
              <div
                style={{
                  boxShadow: "0px 15px 20px 0px #00000040 ",
                  border: "2px solid #07617d",
                }}
                className="bg-white w-80 space-y-2 cursor-pointer rounded-xl border-secondary border-2"
              >
                <div className="p-2">
                  <img
                    src={Analytics}
                    className="rounded-xl bg-cover w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-2xl text-secondary">
                    Comprehensive Analytics
                  </div>
                  <div className="text-[#2E383F] pt-4">
                  Gain deep insights with our powerful analytics capabilities like Graphs
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl">
              <div
                style={{
                  boxShadow: "0px 15px 20px 0px #00000040 ",
                  border: "2px solid #07617d",
                }}
                className="bg-white w-80 space-y-2 cursor-pointer rounded-xl border-2"
              >
                <div className="p-2">
                  <img
                    src={Feedback}
                    className="rounded-xl bg-cover w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-2xl text-secondary">
                  Customer Feedback and Support
                  </div>
                  <div className="text-[#2E383F] pt-4">
                  We Welcome every feedback from our Customers and we thrive to address their Queries.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
