import IconText from "../assets/svgs/IconText.svg"
// import Instagram from "../assets/svgs/Instagram.svg"
// import X from "../assets/svgs/X.svg"
// import Linkedin from "../assets/svgs/LinkedIn.svg"

export const Footer = () => {
  return (
    <>
      <footer className="border-t-2 border-secondary" style={{boxShadow: "0px -10px 30px 0px #00000040"}}>
        <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
          <div className="lg:w-1/3">
            <a
              rel="noopener noreferrer"
              href="#"
              className="flex justify-center space-x-3 lg:justify-start"
            >
              <div className="leading-none space-y-4" >
                <img src={IconText} className="w-52"/>
                <div className="text-secondary w-52 text-xl leading-none text-center">
                  YOUR STATISTICAL SOLUTION HUB
                </div>
              </div>
            </a>
          </div>
          <div className="grid grid-cols-1 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-2 px-4">
            <div className="space-y-3">
              <h3 className="tracking-wide uppercase font-medium text-2xl text-[#2E383F]">TOOLS</h3>
              <ul className="space-y-2 text-lg text-primary">
                <li className="">
                  <a rel="noopener noreferrer" href="/continuous-metric-testing">
                    Continuous Metric Testing Tool
                  </a>
                </li>
                <li className="">
                  <a rel="noopener noreferrer" href="/proportional-metric-testing">
                    Proportional Metric Testing Tool
                  </a>
                </li>
                <li className="">
                  <a rel="noopener noreferrer" href="/ab-testing">
                    A/B Testing Calculator
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="tracking-wide uppercase font-medium text-2xl text-[#2E383F]">COMPANY</h3>
              <ul className="space-y-2 text-lg text-primary">
                <li>
                  <a rel="noopener noreferrer" href="/articles">
                    Our Articles
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/terms-and-conditions">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/privacy-policy">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/about-us">
                    About Us
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/community-analytics">
                    Community Analytics
                  </a>
                </li>
              </ul>
            </div>
            {/* <div className="space-y-3">
              <div className="uppercase font-medium text-2xl text-[#2E383F]">FOLLOW US</div>
              <div className="flex justify-start space-x-3">
                <a
                  rel="noopener noreferrer"
                  href="#"
                  title="Facebook"
                  className="flex items-center p-1"
                >
                  <img src={Instagram}/>
                </a>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  title="Twitter"
                  className="flex items-center p-1"
                >
                  <img src={X}/>
                </a>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  title="Instagram"
                  className="flex items-center p-1"
                >
                  <img src={Linkedin}/>
                </a>
              </div>
            </div> */}
          </div>
        </div>
        <div className="py-6 text-sm text-center border-t-secondary border-t">
          © 2024 - All Rights Reserved, AB Testing Hub
        </div>
      </footer>

    </>
  );
};