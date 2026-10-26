
import React from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Users, MessageSquareText, ArrowRight } from "lucide-react";

export default function RecruiterAI() {
  const features = [
    {
      title: "AI Applicant Screening",
      description:
        "Compare an applicant's candidate profile with the job requirements and identify matching skills and areas to discuss.",
      icon: Users,
      path: "/recruiter/ai/resume-screening",
    },
    {
      title: "AI Interview Questions",
      description:
        "Generate technical and behavioral interview questions based on a job's requirements.",
      icon: MessageSquareText,
      path: "/recruiter/ai/interview-questions",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3 text-indigo-600">
            <BrainCircuit size={32} />
            <span className="font-semibold">SmartHire AI</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Recruiter AI Assistant
          </h1>

          <p className="mt-3 text-slate-600">
            AI-powered tools to support your recruitment workflow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-indigo-300 hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={27} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {feature.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-7 flex items-center gap-2 font-semibold text-indigo-600">
                  Open Feature
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-slate-500">
          AI suggestions are advisory. Recruitment decisions should be reviewed
          by a human recruiter.
        </p>
      </div>
    </div>
  );
}
