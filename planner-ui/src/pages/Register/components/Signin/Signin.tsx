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
import { Loader2, Wallet, FolderTree, ChartPie, LineChart } from "lucide-react";
import { Path } from "@main";
import { useState, useEffect } from "react";
import { Label } from "@components/ui/label";
import { cn } from "@lib/utils";

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

export const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    mode: "onChange"
  });

  const { register, handleSubmit, formState: { errors, isValid }, setError } = form;

  const loginMutation = useLogin();
  const createUserMutation = useCreateUser();

  const isLoading = loginMutation.isPending || createUserMutation.isPending;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen flex">
      {/* Lewa strona - Slider */}
      <div className="hidden lg:block lg:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-center transition-opacity duration-500 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {feature.icon}
              <h3 className="mt-8 text-2xl font-bold">{feature.title}</h3>
              <p className="mt-4 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? 'bg-primary w-4'
                  : 'bg-primary/20'
              }`}
              aria-label={`Przejdź do slajdu ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Prawa strona - Formularz */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isLogin ? 'Zaloguj się' : 'Utwórz konto'}
          </h2>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              {errors.root && (
                <Alert variant="destructive">
                  {errors.root.message}
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={cn(errors.password && "border-destructive focus-visible:ring-destructive")}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      type="text"
                      {...register("firstName")}
                      className={cn(errors.firstName && "border-destructive focus-visible:ring-destructive")}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      type="text"
                      {...register("lastName")}
                      className={cn(errors.lastName && "border-destructive focus-visible:ring-destructive")}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full" 
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

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? 'Nie masz jeszcze konta?' : 'Masz już konto?'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-primary hover:underline"
                  disabled={isLoading}
                >
                  {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
                </button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Signin;

