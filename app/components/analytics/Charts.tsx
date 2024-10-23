"use clients";
import { ChartDateProps, NameValueProps } from "app/lib/types/analytics";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomTooltip = ({ active, payload, label, suffix, fixed }: any) => {
  if (active && payload && payload.length) {
    return (
      <>
        <style>
          {`
                .toolWrapper {
                    background-color: #fff;
                    padding: 5px 7px;
                    background: var(--p-color-bg-surface);
                    border-radius: var(--p-border-radius-300);
                    border: 2px solid var(--p-color-bg-surface-tertiary-hover);
                    border-radius: 6px;
                    box-shadow: var(--p-shadow-100);
                }
                
                .toolWrapper p {
                    font-size: 13px;
                    font-weight: 500;
                    line-height: 20px;
                    color: black;
                    margin-left: 3px;
                }
            `}
        </style>
        <div className={"toolWrapper"}>
          <p className="label">
            {`${label}: `}
            <span
              style={{ fontWeight: 550 }}
            >{`${payload[0].value}${suffix}`}</span>
          </p>
        </div>
      </>
    );
  }
};

const CustomYAxisTick = (props: any) => {
  const { x, y, payload, suffix, fixed } = props;

  return (
    <text
      x={x}
      y={y}
      dy={0}
      textAnchor="end"
      fill="rgb(112, 112, 123)"
      transform="rotate(0)"
      fontSize={"11px"}
    >
      {`${Number(payload.value).toFixed(fixed)}${suffix ? suffix : ""}`}{" "}
    </text>
  );
};

const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;

  return (
    <text
      x={x}
      y={y + 15}
      dy={0}
      textAnchor="middle"
      fill="rgb(112, 112, 123)"
      transform="rotate(0)"
      fontSize={"11px"}
      alignmentBaseline="central"
    >
      {`${payload.value}`}
    </text>
  );
};

export const LineChartStats = ({
  data,
  suffix,
}: {
  data: ChartDateProps[];
  suffix?: "%" | "h" | "";
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c6beff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid horizontal={false} vertical={false} />
        <XAxis
          interval="preserveStartEnd"
          dataKey="date"
          padding={{ left: 10, right: 10 }}
          axisLine={false}
          tickSize={0}
          tick={<CustomXAxisTick />}
        />
        <YAxis
          axisLine={false}
          padding={{ top: 0, bottom: 5 }}
          tickSize={0}
          tick={<CustomYAxisTick suffix={suffix} fixed={1} />}
        />
        <Tooltip content={<CustomTooltip suffix={suffix} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#5700d1"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const BarChartStats = ({
  data,
  suffix,
  fixed = 1,
  color = "#a1a5f4",
}: {
  data: any[];
  suffix: "%" | "h" | "";
  fixed?: number;
  color?: string;
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -35, bottom: 5 }}>
        <CartesianGrid horizontal={false} vertical={false} />
        <XAxis
          interval="preserveStartEnd"
          dataKey="name"
          padding={{ left: 10, right: 10 }}
          axisLine={false}
          tickSize={0}
          tick={<CustomXAxisTick />}
        />
        <YAxis
          axisLine={false}
          padding={{ top: 10, bottom: 0 }}
          type="number"
          tickSize={0}
          tick={<CustomYAxisTick suffix={suffix} fixed={fixed} />}
        />
        {/* <Tooltip /> */}
        <Tooltip content={<CustomTooltip suffix={suffix} fixed={fixed} />} />
        <Bar dataKey="value" fill={color} shape={<RoundedBar />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const RoundedBar = (props: any) => {
  const { fill, x, y, width, height } = props;

  if (width <= 0 || height <= 0) {
    return null;
  }

  return (
    <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} ry={6} />
  );
};

export const PieChartStats = ({ data }: { data: any[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={60}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          activeIndex={activeIndex}
          onMouseEnter={onPieEnter}
          activeShape={renderActiveShape}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export const COLORS = [
  "#03045E",
  "#023E8A",
  "#0077B6",
  "#0096C7",
  "#00B4D8",
  "#48CAE4",
  "#90E0EF",
  "#ADE8F4",
  "#CAF0F8",
];

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 13} dy={10} textAnchor="middle" fill={fill}>
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

export const HalfCircleStats = ({
  data,
  completed,
  text,
}: {
  data: NameValueProps[];
  completed: number;
  text: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <Pie
          data={data}
          cx="50%"
          cy="80%"
          innerRadius={120}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          activeIndex={activeIndex}
          onMouseEnter={onPieEnter}
          activeShape={(p: any) => renderHalfShape(p, completed, text)}
          startAngle={180}
          endAngle={0}
          paddingAngle={1}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={HALF_CIRCLE[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const HALF_CIRCLE = ["#5700d1", "#39393a"];

const renderHalfShape = (props: any, completed: number, text: string) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  return (
    <g>
      <text
        x={"50%"}
        y={"50%"}
        dy={8}
        textAnchor="middle"
        fill={"#39393a"}
        fontSize="24px"
        fontWeight="bold"
        letterSpacing="0px"
      >
        {`${(completed * 100).toFixed(0)}%`}
      </text>
      <text
        x={"50%"}
        y={"60%"}
        dy={4}
        textAnchor="middle"
        fill={"#39393a"}
        fontSize="12px"
        fontWeight="300"
        letterSpacing="0.2px"
      >
        {text}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};
