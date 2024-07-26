// import styled from "../css/PrivacyPolicy.css";
import { Container } from "@mui/material";
import CommunityAnalyticsBackground from "../assets/images/CommunityAnalyticsBackground.jpg";
import { useNavigate } from "react-router-dom";

export const CommunityAnalytics = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{ background: `url(${CommunityAnalyticsBackground})` }}
        className="flex justify-center"
      >
        <Container className="py-16">
          <div className="flex flex-col gap-8 text-white text-center">
            <div className="text-3xl lg:text-5xl">COMMUNITY ANALYTICS</div>
            <div className="text-lg lg:text-2xl">
              Welcome to the Community Analytics page of AB Testing Hub! Here,
              you can explore the vibrant activity and engagement within our
              platform. We believe in transparency and are excited to share our
              community's growth and achievements with you.
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="flex flex-col gap-12">
          <div className="text-xl lg:text-3xl text-center">Key Metrics</div>
          <div className="space-y-2">
            <div className="text-secondary text-lg lg:text-2xl">
              - Total Hypotheses Generated
            </div>
            <div className="text-lg lg:text-2xl">
              Our users have generated an impressive{" "}
              <span className="text-primary">12,540 hypotheses</span> to date,
              showcasing the creativity and innovation within our community.
              Each hypothesis represents a step towards data-driven
              decision-making and continuous improvement.
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-secondary text-lg lg:text-2xl">
              - No. of User Groups Signed Up
            </div>
            <div className="text-lg lg:text-2xl">
              Join a thriving community of{" "}
              <span className="text-primary">8,230 Members</span> who are
              passionate about A/B testing and experimentation. Our growing user
              base contributes to a diverse and dynamic exchange of ideas and
              insights.
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-secondary text-lg lg:text-2xl">
              - Experiment Success Rate
            </div>
            <div className="text-lg lg:text-2xl">
              Our community boasts a{" "}
              <span className="text-primary">67% Success Rate</span> for
              experiments, highlighting the effectiveness and impact of the
              hypotheses tested on our platform.
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-secondary text-lg lg:text-2xl">
              - User Retention Rate
            </div>
            <div className="text-lg lg:text-2xl">
              With an <span className="text-primary">85%</span> Monthly
              Retention Rate, our community members find lasting value in the
              tools and resources provided by AB Testing Hub.
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-secondary text-lg lg:text-2xl">
              - Feedback and Suggestions Implemented
            </div>
            <div className="text-lg lg:text-2xl">
              We value our community's input, having implemented{" "}
              <span className="text-primary">
                1200 user suggestions in the past year{" "}
              </span>
              , ensuring that our platform evolves to meet your needs.
            </div>
          </div>
          <div className="text-xl lg:text-3xl text-center">
            Why Analytics Matter?
          </div>
          <div className="text-lg lg:text-2xl text-[#2E383F]">
            Understanding our community's activity helps us improve and tailor
            our services to better meet your needs. By sharing these insights,
            we aim to foster a sense of belonging and collective achievement.
            Your participation and contributions are the driving forces behind
            our success!
          </div>
          <div className="text-xl lg:text-3xl text-center">
            Join the Community
          </div>
          <div className="text-lg lg:text-2xl text-[#2E383F]">
            Not a member yet?{" "}
            <a
              href="#"
              className="text-primary"
              onClick={(e) => {
                e.preventDefault();
                navigate("/home", { state: { showSignup: true } });
              }}
            >
              Signup
            </a>{" "}
            today and become part of a growing community dedicated to mastering
            the art and science of A/B testing. Together, we can achieve more!
          </div>
        </div>
      </Container>
    </div>
  );
};
