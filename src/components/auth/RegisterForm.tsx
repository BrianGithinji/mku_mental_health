import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import mkuLogo from 'figma:asset/14595c554c029d987635aae1d898f92cd008b33f.png';
import { registerUser } from '../../utils/auth';

interface RegisterFormProps {
  onRegister: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
    course: string;
    password: string;
  }) => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    course: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const { confirmPassword, ...userData } = formData;
      const user = await registerUser(userData);
      onRegister(user);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={mkuLogo} alt="MKU Logo" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join the Mental Health Dashboard
          </CardDescription>
          <p className="text-xs italic text-muted-foreground/80 mt-2">mentis salus scientia et auxilium</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="bsccs202459607@mylife.mku.ac.ke"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student / Staff ID</Label>
              <Input
                id="studentId"
                placeholder="BSCCS/2024/59607 or MKU/2024/001"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select onValueChange={(value) => handleInputChange('course', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="business">Business Administration</SelectItem>
                  <SelectItem value="psychology">Psychology</SelectItem>
                  <SelectItem value="nursing">Nursing</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleInputChange('gender', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" className="p-0" onClick={onSwitchToLogin}>
                Sign in
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}