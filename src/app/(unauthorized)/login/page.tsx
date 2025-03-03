"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ChevronLeft, ChevronRight, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import SwitchTransition from "@/components/animations/switch-transition";
import { useLoading } from "@/contexts/LoadingContext";

import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

import { toast } from "sonner";
import { handleAuthOperation } from "@/firebase/errors";

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "The e-mail must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "The password must be at least 2 characters.",
  }),
});

export default function Login() {
  const router = useRouter();
  const { setLoading } = useLoading();

  const [view, setView] = useState<"email" | "password">("email");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading({
      loading: true,
      text: "please wait, as we set everything up for you",
      showTimer: true,
    });

    try {
      await handleAuthOperation(async () => {
        // Your Firebase auth code here, e.g.:
        await signInWithEmailAndPassword(auth, data.email, data.password);
      });

      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Uh oh! Something went wrong.", {
        description: err.message,
      });
    } finally {
      setLoading({ loading: false });
    }
  };

  return (
    <AnimatePresence mode="wait">
      <div className="flex items-center justify-center w-full h-full bg-zinc-900 min-h-screen">
        <div className="p-8 bg-zinc-800 shadow-lg rounded-lg max-w-[400px] border border-zinc-700">
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
            className="flex flex-col items-start gap-6"
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-white">Welcome back</h1>
              <h1 className="text-md text-zinc-400">
                Login to your account to continue
              </h1>
            </div>

            <AnimatePresence mode="wait">
              <Form {...form}>
                <motion.form
                  layout
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-6 overflow-hidden"
                >
                  <SwitchTransition
                    state={view}
                    components={{
                      email: (
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-300">
                                E-mail
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="email@example.com"
                                  className="bg-zinc-900 border-zinc-700 focus:border-[#5c55df] text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-zinc-500">
                                Type the e-mail you registered
                              </FormDescription>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      ),
                      password: (
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-300">
                                Password
                              </FormLabel>
                              <FormControl>
                                <PasswordInput
                                  placeholder="*******"
                                  className="bg-zinc-900 border-zinc-700 focus:border-[#5c55df] text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-zinc-500">
                                Your secure password
                              </FormDescription>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      ),
                    }}
                  />

                  <div className="w-full justify-between items-center flex gap-2 pt-2">
                    <SwitchTransition
                      state={view}
                      components={{
                        email: (
                          <span
                            className="text-[#5c55df] text-sm flex items-center gap-2 hover:underline cursor-pointer"
                            onClick={() =>
                              router.push("/unauthorized/register")
                            }
                          >
                            Create an account
                          </span>
                        ),
                        password: (
                          <span
                            className="text-[#5c55df] text-sm flex items-center gap-2 hover:underline cursor-pointer"
                            onClick={() => setView("email")}
                          >
                            <ChevronLeft size={16} /> Go back
                          </span>
                        ),
                      }}
                    />

                    <SwitchTransition
                      state={view}
                      transitionType="x"
                      components={{
                        email: (
                          <Button
                            type="button"
                            className="bg-[#5c55df] hover:bg-[#4a43de] text-white"
                            onClick={() => setView("password")}
                          >
                            Next <ChevronRight className="ml-2" size={16} />
                          </Button>
                        ),
                        password: (
                          <Button
                            type="submit"
                            className="bg-[#5c55df] hover:bg-[#4a43de] text-white"
                          >
                            Login <LogIn className="ml-2" size={16} />
                          </Button>
                        ),
                      }}
                    />
                  </div>
                </motion.form>
              </Form>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
