"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Shield, Users, CreditCard, PieChart, Upload, CheckCircle2 } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/aceternity/bento-grid";
import { Button as MovingBorderButton } from "@/components/ui/aceternity/moving-border";
import { CardBody, CardContainer, CardItem } from "@/components/ui/aceternity/3d-card";
import { ContainerScroll } from "@/components/ui/aceternity/container-scroll-animation";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden !scroll-smooth transition-colors duration-300">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-white/20 dark:supports-[backdrop-filter]:bg-black/20">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6 text-indigo-500" />
              <span className="hidden font-bold sm:inline-block text-black dark:text-white">
                Expense Manager
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-4">
              <ModeToggle />
              <Link href="/login">
                <Button variant="ghost" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10">Login</Button>
              </Link>
              <Link href="/register">
                <MovingBorderButton
                  borderRadius="1.75rem"
                  className="bg-indigo-600 text-white border-transparent"
                  containerClassName="h-10 w-32"
                >
                  Get Started
                </MovingBorderButton>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[40rem] flex items-center justify-center overflow-hidden pt-16 bg-white dark:bg-black/0 transition-colors duration-300">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 text-center">

            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 to-neutral-900 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50">
              Smart Expense Management <br /> for Owners & Employees
            </h1>

            {/* Text Generate Effect for Subheading */}
            <div className="mt-4 font-normal text-base text-neutral-600 dark:text-neutral-300 max-w-lg mx-auto">
              <TextGenerateEffect words="Track expenses, manage employees, control budgets, and gain insights — all in one secure platform." className="text-center font-normal" />
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register">
                <MovingBorderButton
                  borderRadius="1.75rem"
                  className="bg-indigo-600 text-white border-transparent"
                >
                  Get Started
                </MovingBorderButton>
              </Link>
              <Link href="/login">
                <MovingBorderButton
                  borderRadius="1.75rem"
                  className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                >
                  Login
                </MovingBorderButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section (Container Scroll) */}
        <section className="flex flex-col overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-black dark:text-white">
                  Experience the power of <br />
                  <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-indigo-500">
                    Smart Analytics
                  </span>
                </h1>
              </>
            }
          >
            <Image
              src={`https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top draggable-false"
              draggable={false}
            />
          </ContainerScroll>
        </section>

        {/* Who Is This For Section */}
        <section className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
          <Reveal>
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-12 text-black dark:text-white">Who Is This For?</h2>
              <div className="flex flex-wrap justify-center gap-8">
                {/* Owner Card */}
                <CardContainer className="inter-var">
                  <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-indigo-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border transition-colors duration-300">
                    <CardItem
                      translateZ="50"
                      className="text-xl font-bold text-neutral-600 dark:text-white"
                    >
                      👑 For Owners / Admins
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      Total control over your business finances.
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <ul className="space-y-2 text-neutral-500 dark:text-neutral-400">
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Manage employees & expenses</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Category & project tracking</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Budget control</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Analytics dashboard</li>
                      </ul>
                    </CardItem>
                  </CardBody>
                </CardContainer>

                {/* Employee Card */}
                <CardContainer className="inter-var">
                  <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-indigo-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border transition-colors duration-300">
                    <CardItem
                      translateZ="50"
                      className="text-xl font-bold text-neutral-600 dark:text-white"
                    >
                      👷 For Employees
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      Simple expense submission and tracking.
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <ul className="space-y-2 text-neutral-500 dark:text-neutral-400">
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Submit expenses easily</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> View own expense history</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Upload bills</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Fast & Mobile friendly</li>
                      </ul>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-white dark:bg-black transition-colors duration-300">
          <Reveal>
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-12 text-black dark:text-white">Core Features</h2>
              <BentoGrid className="max-w-4xl mx-auto">
                {items.map((item, i) => (
                  <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    icon={item.icon}
                    className={cn(item.className, "border-neutral-200 dark:border-white/[0.2] bg-white dark:bg-black shadow-none border")}
                  />
                ))}
              </BentoGrid>
            </div>
          </Reveal>
        </section>

        {/* Security Section with Background Gradient on Cards maybe? Or kept simple for contrast */}
        <section className="py-20 bg-indigo-50/50 dark:bg-indigo-950/20 border-y border-indigo-200 dark:border-indigo-500/10 transition-colors duration-300">
          <Reveal>
            <div className="container px-4 md:px-6 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-full">
                  <Shield className="w-10 h-10 text-indigo-600 dark:text-indigo-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Enterprise-Grade Security</h2>
              <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8">
                Built with role-based access control (RBAC). Your data is isolated per owner, ensuring no employee can see sensitive company data or other's expenses.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mt-10">
                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800">
                  <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                    Secure Login
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Protected with industry standard encryption and authentication.
                  </p>
                </BackgroundGradient>
                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800">
                  <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                    Data Isolation
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Strict data separation ensures privacy for every organization.
                  </p>
                </BackgroundGradient>
              </div>
            </div>
          </Reveal>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
          <div className="absolute inset-0 bg-indigo-600/5 blur-[100px] rounded-full" />
          <div className="container px-4 md:px-6 relative z-10 text-center">
            <Reveal>
              <h2 className="text-4xl font-bold text-black dark:text-white mb-6">Start managing expenses the smart way.</h2>
              <div className="flex justify-center gap-4 mt-8">
                <Link href="/register">
                  <MovingBorderButton
                    borderRadius="1.75rem"
                    className="bg-indigo-600 text-white border-transparent"
                  >
                    Create Account
                  </MovingBorderButton>
                </Link>
                <Link href="/login">
                  <MovingBorderButton
                    borderRadius="1.75rem"
                    className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-neutral-800"
                  >
                    Login
                  </MovingBorderButton>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}

const SkeletonOne = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-4 border border-transparent dark:border-white/[0.2] flex-col space-y-2">
    <div className="flex flex-row items-center space-x-2 bg-white dark:bg-black p-2 rounded-md shadow-sm">
      <div className="h-6 w-6 rounded-full bg-indigo-500" />
      <div className="h-2 w-20 bg-gray-200 dark:bg-neutral-700 rounded-full" />
    </div>
    <div className="flex flex-row items-center space-x-2 bg-white dark:bg-black p-2 rounded-md shadow-sm opacity-70">
      <div className="h-6 w-6 rounded-full bg-pink-500" />
      <div className="h-2 w-16 bg-gray-200 dark:bg-neutral-700 rounded-full" />
    </div>
    <div className="flex flex-row items-center space-x-2 bg-white dark:bg-black p-2 rounded-md shadow-sm opacity-40">
      <div className="h-6 w-6 rounded-full bg-orange-500" />
      <div className="h-2 w-12 bg-gray-200 dark:bg-neutral-700 rounded-full" />
    </div>
  </div>
);

const SkeletonTwo = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-4 border border-transparent dark:border-white/[0.2] flex-col justify-end">
    <div className="w-full bg-white dark:bg-black rounded-lg p-2 shadow-sm">
      <div className="h-2 w-full bg-gray-200 dark:bg-neutral-700 rounded-full mb-2">
        <div className="h-full bg-indigo-500 rounded-full" style={{ width: "70%" }} />
      </div>
      <div className="h-2 w-full bg-gray-200 dark:bg-neutral-700 rounded-full">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "45%" }} />
      </div>
    </div>
  </div>
);

const SkeletonThree = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-4 border border-transparent dark:border-white/[0.2] items-center justify-center">
    <div className="relative h-24 w-24 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
      <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full" style={{ transform: "rotate(45deg)" }} />
      <span className="font-bold text-indigo-500">75%</span>
    </div>
  </div>
);

const SkeletonFour = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-4 border border-transparent dark:border-white/[0.2] items-center justify-center">
    <div className="h-full w-full border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500">
      <Upload className="h-8 w-8 mb-2" />
      <span className="text-xs">Drag files here</span>
    </div>
  </div>
);

const Reveal = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const items = [
  {
    title: "Employee Management",
    description: "Add, manage, and track employee expenses with ease.",
    header: <SkeletonOne />,
    icon: <Users className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
  {
    title: "Category Tracking",
    description: "Organize expenses by custom categories.",
    header: <SkeletonTwo />,
    icon: <LayoutDashboard className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Project Budgets",
    description: "Keep your projects on track with strict budget monitoring.",
    header: <SkeletonThree />,
    icon: <PieChart className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Expense Uploads",
    description: "Employees can upload bills and receipts directly.",
    header: <SkeletonFour />,
    icon: <Upload className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
];
