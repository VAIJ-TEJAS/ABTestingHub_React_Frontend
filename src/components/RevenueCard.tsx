import CountUp from "react-countup";

interface RevenueCardProps {
  amount: number;
  icon: string;
  bgColor: string;
  title: string;
  prefix?: string;
}

export const RevenueCard = ({
  amount,
  icon,
  bgColor,
  title,
  prefix,
}: RevenueCardProps) => {

  console.log(bgColor)

  return (
    <div
      className="mt-4 border-2 border-secondary rounded p-4 flex-1 h-60"
      style={{ boxShadow: "0px 2px 25px 0px #00000040" }}
    >
      <div className="flex flex-col justify-between w-full h-full">
        <div className="flex justify-center">
          <img src={icon}/>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="text-secondary uppercase text-left text-lg">
            {title}
          </div>
          <div className="text-5xl font-medium text-green-600">
            <CountUp
              start={0}
              end={amount ?? 0}
              duration={0.5}
              separator=","
              prefix={prefix}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
