import React from "react"
import Navbar from "@/components/Navbar/Navbar"
import graph from "@/components/ui/graph"
import { Label } from "@/components/ui/label"
function GraphTemp() {
    const points = [
        { x: 42, y: 87, color: "#ffaaaa" },
        { x: 58, y: 91, color: "#ffaaaa" },
        { x: 73, y: 69, color: "#ffaaaa" },
        { x: 89, y: 63, color: "#ffaaaa" },
        { x: -58, y: -89, color: "#aaffaa" },
        { x: -74, y: -65, color: "#aaffaa" },
        { x: -67, y: -76, color: "#aaffaa" }
      ];
    return (
        <>
            <Navbar />
            <div className="flex flex-col gap-3 justify-center items-center">
                <Label className="text-[4vh]">Temporary Graph Page</Label>
                {graph({ points })}
            </div>
        </>
    )
}

export default GraphTemp