import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { GraduationCap, ArrowRight } from 'lucide-react';
import MotionWrapper from '@/components/ui/MotionWrapper';

import { apiClient, type SignUpRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { GoogleSignInButton } from '@/components/ui/GoogleSignInButton';

const ENGINEERING_DEPARTMENTS = [
  'CSE',
  'ECE',
  'ISE',
  'Mechanical',
  'Civil',
  'Electrical',
  'Electronics',
  'Chemical',
  'Aerospace',
  'Biotechnology',
  'Information Science',
  'Computer Science',
];

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string(),
  email: z.string().email('Please enter a valid email address'),
  graduationBatch: z.string().optional(),
  graduationDepartment: z.string().optional(),
  usn: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      graduationBatch: '',
      graduationDepartment: '',
      usn: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const signupData: SignUpRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        graduationBatch: data.graduationBatch ? Number(data.graduationBatch) : undefined,
        graduationDepartment: data.graduationDepartment?.trim() || undefined,
        usn: data.usn?.trim() || undefined,
      };

      const response = await apiClient.signup(signupData);
      login(response);
      toast({
        title: 'Account created successfully',
        description: `Welcome, ${response.firstName}! Please complete your profile.`,
      });

      // Redirect to profile setup if profile is not complete
      if (!response.profileComplete) navigate('/profile-setup');
      else navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Sign up failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <MotionWrapper className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F8F8] via-[#FFF9E6] to-[#F8F8F8] p-4 pt-24">
        <Helmet>
          <title>Join Us - DSCE Alumni Connect</title>
          <meta name="description" content="Create your account to join the DSCE Alumni network and start connecting." />
        </Helmet>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-[#003366] mb-6 shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#003366]">
              Join DSCE Alumni Connect
            </h2>
            <p className="mt-2 text-[#333333]">
              Create your account to stay connected
            </p>
          </div>

          <div className="rounded-xl border border-[#003366]/10 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            className="border-[#003366]/10 bg-[#F8F8F8] text-[#333333] placeholder:text-gray-500 focus-visible:ring-[#003366]/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="border-[#003366]/10 bg-[#F8F8F8] text-[#333333] placeholder:text-gray-500 focus-visible:ring-[#003366]/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#333333]">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="border-[#003366]/10 bg-[#F8F8F8] text-[#333333] placeholder:text-gray-500 focus-visible:ring-[#003366]/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="graduationBatch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Graduation Batch</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
                            step="1"
                            placeholder="2023"
                            className="border-[#003366]/10 bg-[#F8F8F8] text-[#333333] placeholder:text-gray-500 focus-visible:ring-[#003366]/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="graduationDepartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#333333]">Graduation Department</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Select or type department"
                              list="departments"
                              className="border-[#003366]/10 bg-[#F8F8F8] text-[#333333] placeholder:text-gray-500 focus-visible:ring-[#003366]/50"
                              {...field}
                            />
                            <datalist id="departments">
                              {ENGINEERING_DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept} />
                              ))}
                            </datalist>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="usn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#333333]">USN (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="i.e. 1DS21EC115"
                          className="border-[#003366]/10 bg-[#F8F8F8] text-[#333333] placeholder:text-gray-500 focus-visible:ring-[#003366]/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#333333]">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="border-[#003366]/10 bg-[#F8F8F8] text-[#333333] placeholder:text-gray-500 focus-visible:ring-[#003366]/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#333333]">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="border-[#003366]/10 bg-[#F8F8F8] text-[#333333] placeholder:text-gray-500 focus-visible:ring-[#003366]/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#FFD700] text-[#003366] hover:bg-[#FFC700] font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#003366]/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <GoogleSignInButton
                  text="Sign up with Google"
                  onSuccess={(response) => {
                    login(response);
                    if (!response.profileComplete) {
                      navigate('/profile-setup');
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                />
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="font-semibold text-[#003366] hover:text-[#00AEEF] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </MotionWrapper>
    </>
  );
}