import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "executive";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      toast.success(`Welcome back, ${data.name}!`);
      navigate(role === "secretary" ? "/secretary-dashboard" : "/executive-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-white hover:bg-white/10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to role selection
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center">
              {role === "secretary" ? "Secretary Login" : "Executive Login"}
            </CardTitle>
            <CardDescription className="text-center text-base">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base"
                style={{
                  background:
                    role === "secretary"
                      ? "hsl(var(--secondary))"
                      : "hsl(var(--primary))",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
