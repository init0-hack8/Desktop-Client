import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AXIS_LENGTH = 100;

const customGraph = ({ points }) => {
  return (
    <Card className="w-[40vw] h-[40vw] p-4">
      <CardContent className="w-full h-full relative">
        {/* Axes */}
        <div className="absolute left-1/2 top-0 w-[2px] h-full bg-gray-400" />
        <div className="absolute top-1/2 left-0 h-[2px] w-full bg-gray-400" />

        {/* Points */}
        {points.map((pt, i) => {
          const x = pt.x;
          const y = pt.y;
          return (
            <>
                <div
                key={i}
                className="absolute w-2 h-2 rounded-full z-[20]"
                style={{
                    backgroundColor: pt.color,
                    left: `calc(50% + ${x}px - 4px)`,
                    top: `calc(50% - ${y}px - 4px)`,
                }}
                />
                <div
                key={i}
                className="absolute w-20 h-20 rounded-full blur-[24px] opacity-[15%] z-[10]"
                style={{
                    backgroundColor: pt.color,
                    left: `calc(50% + ${x}px - 40px)`,
                    top: `calc(50% - ${y}px - 40px)`,
                }}
                />
            </>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default customGraph;
