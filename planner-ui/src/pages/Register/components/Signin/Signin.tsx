import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@components/ui/form";
import { authSchema } from "@schemas/auth.schema";
import type { AuthSchema } from "@schemas/auth.schema";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@reducer/user.reducer";
import { useLogin } from "@services/AuthService/Auth.service";
import { useCreateUser } from "@services/UserService/User.service";
import { Card } from "@components/ui/card";
import { Alert } from "@components/ui/alert";
import { Loader2, Wallet, FolderTree, ChartPie, LineChart, Mail, Lock, User } from "lucide-react";
import { Path } from "@main";
import { useState } from "react";
import { Label } from "@components/ui/label";
import { cn } from "@lib/utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';

const features = [
  {
    icon: <Wallet className="w-12 h-12 text-primary" />,
    title: 'Zarządzanie Kontami',
    description: 'Łatwe zarządzanie wszystkimi Twoimi kontami w jednym miejscu'
  },
  {
    icon: <FolderTree className="w-12 h-12 text-primary" />,
    title: 'Kategorie Wydatków',
    description: 'Organizuj wydatki w przejrzyste kategorie'
  },
  {
    icon: <ChartPie className="w-12 h-12 text-primary" />,
    title: 'Analiza Wydatków',
    description: 'Szczegółowe wykresy i analizy Twoich finansów'
  },
  {
    icon: <LineChart className="w-12 h-12 text-primary" />,
    title: 'Balans Konta',
    description: 'Monitoruj stan swoich finansów w czasie rzeczywistym'
  }
];

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  
  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    mode: "onChange"
  });

  const { register, handleSubmit, formState: { errors, isValid }, setError } = form;

  const loginMutation = useLogin();
  const createUserMutation = useCreateUser();

  const isLoading = loginMutation.isPending || createUserMutation.isPending;

  const onSubmit = handleSubmit(async (data: AuthSchema) => {
    try {
      if (isLogin) {
        const response = await loginMutation.mutateAsync({
          email: data.email,
          password: data.password,
        });
        if (response.data.user) {
          dispatch(setUser(response.data.user));
          navigate(Path.HOME);
        }
      } else {
        const response = await createUserMutation.mutateAsync({
          ...data,
          loginAfterCreate: true
        });
        if (response.data.user) {
          dispatch(setUser(response.data.user));
          navigate(Path.HOME);
        }
      }
    } catch (error: any) {
      setError("root", {
        message: error.response?.data?.message || (isLogin ? "Wystąpił błąd podczas logowania" : "Wystąpił błąd podczas rejestracji"),
      });
    }
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-primary/5">
      {/* Lewa strona - Slider */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-dot-pattern">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/80 to-background/90 backdrop-blur-sm" />
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            speed={800}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            loop={true}
            className="w-full h-full features-swiper relative z-10"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center justify-center h-full p-12 text-center max-w-xl mx-auto">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md shadow-xl border border-primary/10 transform transition-transform hover:scale-105">
                    {feature.icon}
                  </div>
                  <h3 className="mt-8 text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Prawa strona - Formularz */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="p-8 shadow-2xl backdrop-blur-xl bg-background/95 border-primary/10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-2 text-center"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {isLogin ? 'Witaj ponownie!' : 'Dołącz do nas'}
              </h2>
              <p className="text-muted-foreground">
                {isLogin ? 'Zaloguj się do swojego konta' : 'Utwórz nowe konto'}
              </p>
            </motion.div>

            <Form {...form}>
              <AnimatePresence mode="wait">
                <motion.form
                  key={isLogin ? 'login' : 'register'}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.3 }}
                  onSubmit={onSubmit}
                  className="mt-8 space-y-4"
                >
                  {errors.root && (
                    <Alert variant="destructive" className="animate-shake">
                      {errors.root.message}
                    </Alert>
                  )}
                  
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={cn(
                          "h-11 px-4 transition-all duration-200 bg-background/50",
                          errors.email && "border-destructive focus-visible:ring-destructive"
                        )}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-sm font-medium text-destructive flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center">!</span>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Hasło
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        className={cn(
                          "h-11 px-4 transition-all duration-200 bg-background/50",
                          errors.password && "border-destructive focus-visible:ring-destructive"
                        )}
                        disabled={isLoading}
                      />
                      {errors.password && (
                        <p className="text-sm font-medium text-destructive flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center">!</span>
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {!isLogin && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Imię
                          </Label>
                          <Input
                            id="firstName"
                            type="text"
                            {...register("firstName")}
                            className={cn(
                              "h-11 px-4 transition-all duration-200 bg-background/50",
                              errors.firstName && "border-destructive focus-visible:ring-destructive"
                            )}
                            disabled={isLoading}
                          />
                          {errors.firstName && (
                            <p className="text-sm font-medium text-destructive flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center">!</span>
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-medium flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Nazwisko
                          </Label>
                          <Input
                            id="lastName"
                            type="text"
                            {...register("lastName")}
                            className={cn(
                              "h-11 px-4 transition-all duration-200 bg-background/50",
                              errors.lastName && "border-destructive focus-visible:ring-destructive"
                            )}
                            disabled={isLoading}
                          />
                          {errors.lastName && (
                            <p className="text-sm font-medium text-destructive flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center">!</span>
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-2"
                  >
                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base font-medium transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100" 
                      disabled={isLoading || !isValid}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isLogin ? 'Logowanie...' : 'Tworzenie konta...'}
                        </>
                      ) : (
                        isLogin ? 'Zaloguj się' : 'Utwórz konto'
                      )}
                    </Button>

                    <div className="mt-6 text-center space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-muted"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">lub</span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          {isLogin ? 'Nie masz jeszcze konta?' : 'Masz już konto?'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsLogin(!isLogin)}
                          className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors"
                          disabled={isLoading}
                        >
                          {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.form>
              </AnimatePresence>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;

