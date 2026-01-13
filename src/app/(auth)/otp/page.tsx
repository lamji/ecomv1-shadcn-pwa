"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useOtp } from '@/lib/hooks/useOtp';

export default function OtpVerificationPage() {
  const {
    isLoading,
    isResending,
    otpValues,
    timeLeft,
    isExpired,
    email,
    handleInputChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResend,
    formatTime,
  } = useOtp();

  return (
    <div className="bg-background flex min-h-[100dvh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardHeader className="text-center">
          <div className="mb-4 flex flex-col items-center gap-2">
            <Image
              src="/icons/apple-touch-icon.png"
              alt="App Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent a 6-digit code to {email}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-center block">
                Enter verification code
              </Label>
              <div className="flex justify-center gap-2">
                {otpValues.map((value, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:border-primary"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {isExpired ? (
                  <span className="text-destructive">OTP has expired</span>
                ) : (
                  <span>Code expires in {formatTime(timeLeft)}</span>
                )}
              </p>
              
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {isExpired ? 'Request new code' : 'Resend code'}
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-3">
              <Link href="/login" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading || isExpired || otpValues.join('').length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span>Check your spam folder if you don&apos;t see the email</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
