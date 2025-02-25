"use client";
import { Line, ResponsiveContainer, XAxis, YAxis, LineChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const language = [
  { id: "C++", width: "w-[30px]", percentage: "10%" },
  { id: "rust", width: "w-[50px]", percentage: "20%" },
  { id: "java", width: "w-[30px]", percentage: "10%" },
  { id: "typescript", width: "w-[50px]", percentage: "20%" },
  { id: "Go", width: "w-[40px]", percentage: "15%" },
  { id: "shell", width: "w-[40px]", percentage: "15%" },
];
const data = [
  { name: "Mon", value: 3 },
  { name: "Tue", value: 6 },
  { name: "Wed", value: 4 },
  { name: "Thurs", value: 5 },
  { name: "Fri", value: 1 },
  { name: "Sat", value: 6 },
  { name: "Sun", value: 3 },
];

function PreviewImg({ skew }: any) {
  return (
    <div className="">
      <CardContent className={`grid grid-cols-3 gap-4 p-6 pt-14 ${skew}`}>
        <div className="col-span-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Commit Avtivity</CardTitle>
              </CardHeader>
              <CardContent className="mt-6 pl-1 hover:shadow-lg">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <XAxis
                        dataKey="name"
                        stroke="#4B5563"
                        tick={{ fill: "#9CA3AF" }}
                      />
                      <YAxis stroke="#4B5563" tick={{ fill: "#9CA3AF" }} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ fill: "#8B5CF6", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="col-span-1 w-fit">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Languages Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {language.map((lang) => (
                <div
                  key={lang.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
                      {lang.id}
                    </p>
                    <div
                      className={`bg-purple-400 ${lang.width} h-1 mt-2 dark:bg-purple-500 `}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-800 dark:text-gray-200">
                    {lang.percentage}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
}

export default PreviewImg;
