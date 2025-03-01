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
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/dashboard");
    } catch (err) {
      toast.error("Uh oh! Something went wrong.", {
        description: err instanceof Error ? err.message : "Failed to sign up",
      });
    } finally {
      setLoading({ loading: false });
    }
  };

  return (
    <AnimatePresence mode="wait">
      <div className="flex gap-1 items-center justify-center w-full h-full">
        <div className="p-4 bg-zinc-700 shadow-sm rounded-sm max-w-[350px]">
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
            className=" flex flex-col items-start gap-4"
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-white">
                Login to your fake company
              </h1>
              <h1 className="text-md text-zinc-300">
                Dont worry about your credentials, anything really works
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
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="email@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                {'This is your "corporate" e-mail.'}
                              </FormDescription>
                              <FormMessage />
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
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <PasswordInput
                                  placeholder="*******"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Type in any password, really.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ),
                    }}
                  />

                  <div className="w-full justify-between items-center flex gap-2">
                    <SwitchTransition
                      state={view}
                      components={{
                        email: (
                          <span
                            className="text-accent text-sm flex items-center gap-2 hover:underline cursor-pointer"
                            onClick={() =>
                              router.push("/unauthorized/register")
                            }
                          >
                            Create an account
                          </span>
                        ),
                        password: (
                          <span
                            className="text-accent text-sm flex items-center gap-2 hover:underline cursor-pointer"
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
                            onClick={() => setView("password")}
                          >
                            Next <ChevronRight size={16} />
                          </Button>
                        ),
                        password: (
                          <Button variant="secondary" type="submit">
                            Login <LogIn size={16} />
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
