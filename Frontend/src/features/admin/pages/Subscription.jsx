import {
  CreditCard,
  Crown,
  Users,
  IndianRupee,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const plans = [
  {
    id: 1,
    name: "Free",
    users: 982,
    price: "₹0",
    status: "Active",
  },
  {
    id: 2,
    name: "Pro",
    users: 241,
    price: "₹499",
    status: "Active",
  },
  {
    id: 3,
    name: "Enterprise",
    users: 61,
    price: "Custom",
    status: "Active",
  },
];

export default function Subscription() {
  return (
    <>
      <Helmet>
        <title>Subscriptions | InterviewGen AI</title>

        <meta
          name="description"
          content="Manage subscription plans, billing information, payments, revenue insights, and premium memberships from the InterviewGen AI Super Admin dashboard."
        />

        <meta
          name="keywords"
          content="InterviewGen AI, Subscription Management, Billing, Payments, Revenue, Premium Plans, Admin Dashboard"
        />

        <meta name="author" content="InterviewGen AI" />
        <meta name="robots" content="noindex, nofollow" />

        <link
          rel="canonical"
          href="https://interviewgen-ai.vercel.app/IGAI-admin/subscription"
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Subscriptions | InterviewGen AI" />
        <meta
          property="og:description"
          content="Manage subscription plans, billing, payments, revenue insights, and premium memberships from the Super Admin dashboard."
        />
        <meta
          property="og:url"
          content="https://interviewgen-ai.vercel.app/IGAI-admin/subscription"
        />
        <meta
          property="og:image"
          content="https://interviewgen-ai.vercel.app/og-image.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subscriptions | InterviewGen AI" />
        <meta
          name="twitter:description"
          content="Manage subscription plans, billing, payments, revenue insights, and premium memberships from the Super Admin dashboard."
        />
        <meta
          name="twitter:image"
          content="https://interviewgen-ai.vercel.app/og-image.png"
        />
      </Helmet>
      <div className="space-y-8 p-6 lg:p-8 flex items-center justify-center h-[calc(100vh-80px)] flex-col">
        {/* Header */}

        {/* <div>
        <h1 className="text-3xl font-bold">Subscription</h1>

        <p className="mt-2 text-zinc-400">
          Manage subscription plans and revenue.
        </p>
      </div> */}

        {/* Stats */}

        {/* <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <Users className="mb-4 text-blue-500" />

          <p className="text-zinc-400">Premium Users</p>

          <h2 className="mt-2 text-4xl font-bold">302</h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <IndianRupee className="mb-4 text-green-500" />

          <p className="text-zinc-400">Monthly Revenue</p>

          <h2 className="mt-2 text-4xl font-bold">₹1.45L</h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <TrendingUp className="mb-4 text-purple-500" />

          <p className="text-zinc-400">Growth</p>

          <h2 className="mt-2 text-4xl font-bold">+18%</h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <CreditCard className="mb-4 text-orange-500" />

          <p className="text-zinc-400">Active Plans</p>

          <h2 className="mt-2 text-4xl font-bold">3</h2>
        </div>
      </div> */}

        {/* Plans */}

        {/* <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 p-5">
          <h2 className="text-xl font-semibold">Subscription Plans</h2>
        </div>

        <table className="w-full">
          <thead className="bg-zinc-950">
            <tr>
              <th className="p-5 text-left">Plan</th>

              <th className="text-left">Price</th>

              <th className="text-center">Users</th>

              <th className="text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="border-t border-zinc-800 hover:bg-zinc-800/40"
              >
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <Crown className="text-yellow-500" />

                    {plan.name}
                  </div>
                </td>

                <td>{plan.price}</td>

                <td className="text-center">{plan.users}</td>

                <td className="text-center">
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-400">
                    {plan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

        {/* Payment Summary */}

        {/* <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <CheckCircle2 className="mb-4 text-green-500" />

          <h2 className="text-xl font-semibold">Successful Payments</h2>

          <p className="mt-6 text-5xl font-bold">1,247</p>

          <p className="mt-2 text-zinc-400">Last 30 Days</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <XCircle className="mb-4 text-red-500" />

          <h2 className="text-xl font-semibold">Failed Payments</h2>

          <p className="mt-6 text-5xl font-bold">17</p>

          <p className="mt-2 text-zinc-400">Last 30 Days</p>
        </div>
      </div> */}
        <TriangleAlert className="z-30" size={150} />
        <div className="absolute w-full z-20 h-full top-0 left-0 bg-linear-to-r from-blue-800 to-purple-800 blur-3xl opacity-30 "></div>
        <span className="text-2xl z-30">
          This page is under development, coming soon
        </span>
      </div>
    </>
  );
}
